
import llvm from "llvm-bindings";
import { BinaryExpression, Expression, MemberCall, isBinaryExpression, isBooleanExpression, isFunctionDeclaration, isMemberCall, isNumberExpression } from "../../language/generated/ast.js";
import { DI, IR, getLoc, getCurrScope } from "./util.js";

export function generateExpression(ir: IR, di: DI, expr: Expression): llvm.Value {
    if (isNumberExpression(expr)) {
        return llvm.ConstantFP.get(ir.builder.getDoubleTy(), expr.value);
    } else if (isBooleanExpression(expr)) {
        return ir.builder.getInt1(expr.value);
    } else if (isMemberCall(expr)) {
        return generateMemberCall(ir, di, expr);
    } else if (isBinaryExpression(expr)) {
        return generateBinaryExpr(ir, di, expr);
    }

    console.error(`Expression '${expr.$cstNode?.text}' is not supported.`);
    process.exit(1);
}

function generateBinaryExpr(ir: IR, di: DI, expr: BinaryExpression) {
    const { line, col } = getLoc(expr);
    const left = generateExpression(ir, di, expr.left);
    const right = generateExpression(ir, di, expr.right);
    const op = expr.operator;

    ir.builder.SetCurrentDebugLocation(llvm.DILocation.get(ir.context, line, col, getCurrScope(di)));
    if (op === '+') {
        return ir.builder.CreateFAdd(left, right);
    }

    console.error(`Expression '${expr.$cstNode?.text}' is not supported.`);
    process.exit(1);
}

function generateMemberCall(ir: IR, di: DI, expr: MemberCall): llvm.Value {
    const member = expr.element.ref!;
    const { line, col } = getLoc(expr);
    
    if (isFunctionDeclaration(member)) {
        const func = ir.module.getFunction(member.name);
        if (func) {
            ir.builder.SetCurrentDebugLocation(llvm.DILocation.get(ir.context, line, col, getCurrScope(di)));
            return ir.builder.CreateCall(func, expr.arguments.map(a => generateExpression(ir, di, a)));
        }
        throw new Error(`LLVM IR generation: Function '${member.name}' is not in scope.`);

    } else { // if (isParameter(member) || isVariableDeclaration(member))
        const varName = member.name;

        const globalValue = ir.globalValues.get(varName);
        if (globalValue) {
            return ir.builder.CreateLoad(globalValue.getType().getPointerElementType(), globalValue);
        }

        const alloca = ir.nameToAlloca.get(varName)!;
        if (alloca) {
            return ir.builder.CreateLoad(alloca.getAllocatedType(), alloca);
        }
        throw new Error(`LLVM IR generation: Variable '${varName}' is not in scope.`);
    }
}
