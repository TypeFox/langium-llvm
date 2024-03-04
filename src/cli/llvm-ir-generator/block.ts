import llvm from "llvm-bindings";
import { OxElement, ReturnStatement, Parameter, isFunctionDeclaration, isReturnStatement, isVariableDeclaration, isPrintStatement, PrintStatement, isMemberCall, isExpression, isAssignmentStatement, isBlock } from "../../language/generated/ast.js";
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
    ir.nameToAlloca = new Map<string, llvm.AllocaInst>();

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
            }
            // skip otherwise
        } else if (isBlock(elem)) {
            generateBlock(ir, di, elem.elements);
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
