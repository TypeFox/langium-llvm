import llvm from "llvm-bindings";
import { AssignmentStatement, VariableDeclaration } from "../../language/generated/ast.js";
import { generateExpression } from "./expr.js";
import { DI, IR, getPos, getCurrScope, getDILocation } from "./util.js";

export function generateVariableDeclaration(ir: IR, di: DI, varDecl: VariableDeclaration) {
    const { name, type, value: expr } = varDecl;
    const irType = ir.basicTypes.get(type.primitive)!;
    const { line } = getPos(varDecl);
    const diLoc = getDILocation(ir, di, varDecl);

    const alloca = ir.builder.CreateAlloca(irType, null, name);
    const diLocalVar = di.builder.createAutoVariable(getCurrScope(di), name, di.file, line, di.basicTypes.get(type.primitive)!);
    di.builder.insertDeclare(
        alloca, diLocalVar, di.builder.createExpression(),
        diLoc, ir.builder.GetInsertBlock()!
    );

    ir.builder.SetCurrentDebugLocation(diLoc);

    const value = expr ? generateExpression(ir, di, expr) : llvm.Constant.getNullValue(irType);
    ir.builder.CreateStore(value, alloca);

    ir.nameToAlloca.set(name, alloca);
}

export function generateAssignment(ir: IR, di: DI, assign: AssignmentStatement) {
    const { varRef, value: expr } = assign;

    const name = varRef.ref?.name!;
    const alloca = ir.nameToAlloca.get(name);
    if (!alloca) {
        throw new Error(`LLVM IR generation: assignment to not existing variable '${name}'.`);
    }

    ir.builder.SetCurrentDebugLocation(getDILocation(ir, di, assign));

    // store a new value
    const value = generateExpression(ir, di, expr)
    ir.builder.CreateStore(value, alloca);
}
