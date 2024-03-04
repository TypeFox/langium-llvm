import llvm from "llvm-bindings";
import { AssignmentStatement, VariableDeclaration } from "../../language/generated/ast.js";
import { generateExpression } from "./expr.js";
import { DI, IR, getLoc, getCurrScope } from "./util.js";

export function generateVariableDeclaration(ir: IR, di: DI, varDecl: VariableDeclaration) {
    const { name, type, value: expr } = varDecl;
    const irType = ir.basicTypes.get(type.primitive)!;
    const { line, col } = getLoc(varDecl);
    const scope = getCurrScope(di);

    const alloca = ir.builder.CreateAlloca(irType, null, name);
    const diLocalVar = di.builder.createAutoVariable(scope, name, di.file, line, di.basicTypes.get(type.primitive)!);
    di.builder.insertDeclare(
        alloca,
        diLocalVar,
        di.builder.createExpression(),
        llvm.DILocation.get(ir.context, line, col, scope),
        ir.builder.GetInsertBlock()!
    );

    ir.builder.SetCurrentDebugLocation(llvm.DILocation.get(ir.context, line, col, scope));

    const value = expr ? generateExpression(ir, di, expr) : llvm.Constant.getNullValue(irType);
    ir.builder.CreateStore(value, alloca);

    ir.nameToAlloca.set(name, alloca);
}

export function generateAssignment(ir: IR, di: DI, assign: AssignmentStatement) {
    const { varRef, value: expr } = assign;
    const { line, col } = getLoc(assign);
    const scope = getCurrScope(di);

    const name = varRef.ref?.name!;
    const alloca = ir.nameToAlloca.get(name);
    if (!alloca) {
        throw new Error(`LLVM IR generation: assignment to not existing variable '${name}'.`);
    }

    ir.builder.SetCurrentDebugLocation(llvm.DILocation.get(ir.context, line, col, scope));

    // store a new value
    const value = generateExpression(ir, di, expr)
    ir.builder.CreateStore(value, alloca);

}
