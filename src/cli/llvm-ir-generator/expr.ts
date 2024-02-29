
import llvm from "llvm-bindings";
import { Expression, isBooleanExpression, isNumberExpression } from "../../language/generated/ast.js";
import { DI, IR } from "./util.js";

export function generateExpression(ir: IR, _: DI, expr: Expression): llvm.Value {
    if (isNumberExpression(expr)) {
        return llvm.ConstantFP.get(ir.builder.getDoubleTy(), expr.value);
    } else if (isBooleanExpression(expr)) {
        return ir.builder.getInt1(expr.value);
    }

    console.error(`Expression '${expr.$cstNode?.text}' is not supported.`);
    process.exit(1);
}
