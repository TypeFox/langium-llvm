import llvm from "llvm-bindings";
import { VariableDeclaration } from "../../language/generated/ast.js";
import { generateExpression } from "./expr.js";
import { DI, IR, getLoc, getCurrScope } from "./util.js";

export function generateVariableDeclaration(ir: IR, di: DI, varDecl: VariableDeclaration) {
    const { name, type, assignment, value: expr } = varDecl;
    const { line, col } = getLoc(varDecl);
    const scope = getCurrScope(di);

    const alloca = ir.builder.CreateAlloca(ir.basicTypes.get(type.primitive)!, null, name);
    const diLocalVar = di.builder.createAutoVariable(scope, name, di.file, line, di.basicTypes.get(type.primitive)!);
    di.builder.insertDeclare(
        alloca,
        diLocalVar,
        di.builder.createExpression(),
        llvm.DILocation.get(ir.context, line, col, scope),
        ir.builder.GetInsertBlock()!
    );

    ir.builder.SetCurrentDebugLocation(llvm.DILocation.get(ir.context, line, col, scope));

    if (assignment) {
        ir.builder.CreateStore(generateExpression(ir, di, expr!), alloca);
    }

    ir.nameToAlloca.set(name, alloca);
}
