import llvm from "llvm-bindings";
import { OxElement, ReturnStatement, Parameter, isFunctionDeclaration, isReturnStatement, isVariableDeclaration, isPrintStatement, PrintStatement, isMemberCall, isExpression, isAssignmentStatement, isBlock, isIfStatement, IfStatement, isWhileStatement, isForStatement, ForStatement, Expression, Block } from "../../language/generated/ast.js";
import { generateFunction } from "./func.js";
import { DI, IR, getPos, getCurrScope, getDILocation } from "./util.js";
import { generateAssignment, generateVariableDeclaration } from "./var.js";
import { generateExpression, generateMemberCall } from "./expr.js";

export type FuncInfo = {
    func: llvm.Function,
    inputVars: Parameter[]
}

export function generateBlock(ir: IR, di: DI, elements: OxElement[], funcInfo?: FuncInfo) {
    const backupNamedValues = new Map<string, llvm.AllocaInst>(ir.nameToAlloca);

    if (funcInfo) {
        const { func, inputVars } = funcInfo;
        for (let i = 0; i < inputVars.length; i++) {
            const alloca = generateParameter(ir, di, inputVars[i], i, func);
            ir.nameToAlloca.set(inputVars[i].name, alloca);
        }
    }

    for (const elem of elements) {
        if (isVariableDeclaration(elem)) {
            generateVariableDeclaration(ir, di, elem);
        } else if (isAssignmentStatement(elem)) {
            generateAssignment(ir, di, elem);
        } else if (isFunctionDeclaration(elem)) {
            generateFunction(ir, di, elem);
        } else if (isReturnStatement(elem)) {
            generateReturn(ir, di, elem);
        } else if (isPrintStatement(elem)) {
            generatePrintCall(ir, di, elem);
        } else if (isExpression(elem)) {
            if (isMemberCall(elem)) {
                generateMemberCall(ir, di, elem);
            } else {
                // skip
            }
        } else if (isBlock(elem)) {
            generateBlock(ir, di, elem.elements);
        } else if (isIfStatement(elem)) {
            generateIfStatement(ir, di, elem);
        } else if (isWhileStatement(elem)) {
            generateWhileStatement(ir, di, elem.condition, elem.block);
        } else if (isForStatement(elem)) {
            generateForStatement(ir, di, elem);
        } else {
            throw new Error(`Statement ${elem.$cstNode?.text} is not supported.`);
        }
    }

    ir.nameToAlloca = backupNamedValues;
}

function generateParameter(ir: IR, di: DI, param: Parameter, i: number, func: llvm.Function): llvm.AllocaInst {
    const { name, type } = param;
    const { line } = getPos(param);

    const alloca = ir.builder.CreateAlloca(ir.basicTypes.get(type.primitive)!, null, name);
    ir.builder.CreateStore(func.getArg(i), alloca);

    const diLocalVar = di.builder.createParameterVariable(getCurrScope(di), name, i + 1, di.file, line, di.basicTypes.get(param.type.primitive)!);
    di.builder.insertDeclare(
        alloca, diLocalVar, di.builder.createExpression(),
        getDILocation(ir, di, param), ir.builder.GetInsertBlock()!
    );

    return alloca;
}

function generateReturn(ir: IR, di: DI, ret: ReturnStatement) {
    const value = ret.value ?
        generateExpression(ir, di, ret.value) :
        ir.builder.getInt32(0);

    ir.builder.SetCurrentDebugLocation(getDILocation(ir, di, ret));
    ir.builder.CreateRet(value);
}

function generatePrintCall(ir: IR, di: DI, elem: PrintStatement) {
    const printfFn = ir.module.getFunction('printf')!;
    if (printfFn) {
        const value = generateExpression(ir, di, elem.value);

        const modifier = value.getType().getTypeID() === 13
            ? ir.globalValues.get('integer_modifier')
            : ir.globalValues.get('float_modifier');

        ir.builder.SetCurrentDebugLocation(getDILocation(ir, di, elem));
        return ir.builder.CreateCall(printfFn, [modifier!, value]);
    }

    throw new Error('LLVM IR generation: \'printf\' was not found.');
}

function generateIfStatement(ir: IR, di: DI, { block, condition, elseBlock }: IfStatement) {
    const parentFunc = ir.builder.GetInsertBlock()?.getParent();
    if (parentFunc) {
        let thenBB = llvm.BasicBlock.Create(ir.context, 'then', parentFunc!);
        let elseBB = llvm.BasicBlock.Create(ir.context, 'else');
        const mergeBB = llvm.BasicBlock.Create(ir.context, 'ifend');

        const conditionValue = generateExpression(ir, di, condition);
        ir.builder.CreateCondBr(conditionValue!, thenBB, elseBB);

        ir.builder.SetInsertPoint(thenBB);
        generateBlock(ir, di, block.elements);
        ir.builder.CreateBr(mergeBB);
        thenBB = ir.builder.GetInsertBlock()!;

        parentFunc.insertAfter(parentFunc.getExitBlock(), elseBB);
        ir.builder.SetInsertPoint(elseBB);
        generateBlock(ir, di, elseBlock?.elements ?? []);
        ir.builder.CreateBr(mergeBB);
        elseBB = ir.builder.GetInsertBlock()!;

        parentFunc.insertAfter(parentFunc.getExitBlock(), mergeBB);
        ir.builder.SetInsertPoint(mergeBB);
    }
}

// don't use `WhileStatement` as an argument to reuse it for generation a for statement
function generateWhileStatement(ir: IR, di: DI, condition: Expression | llvm.ConstantInt, block: Block) {
    const parentFunc = ir.builder.GetInsertBlock()?.getParent();
    if (parentFunc) {
        let condBB = llvm.BasicBlock.Create(ir.context, 'whilecond', parentFunc!);
        let loopBB = llvm.BasicBlock.Create(ir.context, 'loop');
        const mergeBB = llvm.BasicBlock.Create(ir.context, 'whileend');

        ir.builder.CreateBr(condBB);
        ir.builder.SetInsertPoint(condBB);
        const conditionValue = isExpression(condition) ? generateExpression(ir, di, condition) : condition;
        ir.builder.CreateCondBr(conditionValue!, loopBB, mergeBB);
        condBB = ir.builder.GetInsertBlock()!;

        parentFunc.insertAfter(parentFunc.getExitBlock(), loopBB);
        ir.builder.SetInsertPoint(loopBB);
        generateBlock(ir, di, block.elements);
        ir.builder.CreateBr(condBB);
        loopBB = ir.builder.GetInsertBlock()!;

        parentFunc.insertAfter(parentFunc.getExitBlock(), mergeBB);
        ir.builder.SetInsertPoint(mergeBB);
    }
}

function generateForStatement(ir: IR, di: DI, { block, condition, counter, execution }: ForStatement) {
    if (counter && isVariableDeclaration(counter)) {
        generateVariableDeclaration(ir, di, counter);
    }

    if (execution) {
        block.elements.push(execution);
    }

    generateWhileStatement(ir, di, condition ?? ir.builder.getInt1(true), block);
}