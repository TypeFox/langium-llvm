import llvm from "llvm-bindings";
import { OxElement, ReturnStatement, Parameter, isFunctionDeclaration, isReturnStatement, isVariableDeclaration } from "../../language/generated/ast.js";
import { generateFunction } from "./func.js";
import { DI, IR, getLoc, getCurrScope } from "./util.js";
import { generateVariableDeclaration } from "./var.js";
import { generateExpression } from "./expr.js";

export type BlockInfo = {
    name: string,
    func?: llvm.Function,
    inputVars?: Parameter[]
}

export function generateExpressionBlock(ir: IR, di: DI, elements: OxElement[],
    { name, func, inputVars }: BlockInfo) {

    const entryBB = llvm.BasicBlock.Create(ir.context, name, func);
    ir.builder.SetInsertPoint(entryBB);

    const backupNamedValues = new Map<string, llvm.AllocaInst>(ir.nameToAlloca);
    ir.nameToAlloca = new Map<string, llvm.AllocaInst>();
    if (func && inputVars) {
        for (let i = 0; i < inputVars.length; i++) {
            const alloca = generateParameter(ir, di, inputVars[i], i, func);
            ir.nameToAlloca.set(inputVars[i].name, alloca);
        }
    }

    for (const elem of elements) {
        if (isVariableDeclaration(elem)) {
            generateVariableDeclaration(ir, di, elem);
        } else if (isFunctionDeclaration(elem)) {
            generateFunction(ir, di, elem);
        } else if (isReturnStatement(elem)) {
            generateReturn(ir, di, elem);
        }
    }

    ir.nameToAlloca = backupNamedValues;
}

function generateParameter(ir: IR, di: DI, param: Parameter, i: number, func: llvm.Function): llvm.AllocaInst {
    const { name, type } = param;
    const { line, col } = getLoc(param);

    const alloca = ir.builder.CreateAlloca(ir.basicTypes.get(type.primitive)!, null, name);
    ir.builder.CreateStore(func.getArg(i), alloca);

    const diVarType = di.basicTypes.get(param.type.primitive)!;
    const diLocalVar = di.builder.createParameterVariable(getCurrScope(di), name, i + 1, di.file, line, diVarType);
    di.builder.insertDeclare(
        alloca, diLocalVar, di.builder.createExpression(),
        llvm.DILocation.get(ir.context, line, col, getCurrScope(di)), ir.builder.GetInsertBlock()!
    );

    return alloca;
}

function generateReturn(ir: IR, di: DI, ret: ReturnStatement) {
    const { line, col } = getLoc(ret);

    const value = ret.value ?
        generateExpression(ir, di, ret.value) :
        ir.builder.getInt32(0);

    ir.builder.SetCurrentDebugLocation(llvm.DILocation.get(ir.context, line, col, getCurrScope(di)));
    ir.builder.CreateRet(value);
}
