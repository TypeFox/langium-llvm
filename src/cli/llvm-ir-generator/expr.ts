
import llvm from "llvm-bindings";
import { BinaryExpression, Expression, MemberCall, UnaryExpression, isBooleanExpression, isFunctionDeclaration, isMemberCall, isNumberExpression, isUnaryExpression } from "../../language/generated/ast.js";
import { DI, IR, getDILocation } from "./util.js";

export function generateExpression(ir: IR, di: DI, expr: Expression): llvm.Value {
    ir.builder.SetCurrentDebugLocation(getDILocation(ir, di, expr));

    if (isNumberExpression(expr)) {
        return llvm.ConstantFP.get(ir.builder.getDoubleTy(), expr.value);
    } else if (isBooleanExpression(expr)) {
        return ir.builder.getInt1(expr.value);
    } else if (isMemberCall(expr)) {
        return generateMemberCall(ir, di, expr);
    } else if (isUnaryExpression(expr)) {
        return generateUnaryExpr(ir, di, expr);
    } else {
        return generateBinaryExpr(ir, di, expr);
    }
}

function generateUnaryExpr(ir: IR, di: DI, expr: UnaryExpression): llvm.Value {
    const value = generateExpression(ir, di, expr.value);
    const op = expr.operator;

    if (op === '-') {
        return ir.builder.CreateFNeg(value);
    } else { // (op === '!')
        return ir.builder.CreateNeg(value);
    }
}

function generateBinaryExpr(ir: IR, di: DI, expr: BinaryExpression): llvm.Value {
    const left = generateExpression(ir, di, expr.left);
    const right = generateExpression(ir, di, expr.right);
    const op = expr.operator;

    if (op === '+') {
        return ir.builder.CreateFAdd(left, right);
    } else if (op === '-') {
        return ir.builder.CreateFSub(left, right);
    } else if (op === '*') {
        return ir.builder.CreateFMul(left, right);
    } else if (op === '/') {
        return ir.builder.CreateFDiv(left, right);
    }

    if (op === '<') {
        return ir.builder.CreateFCmpOLT(left, right);
    } else if (op === '<=') {
        return ir.builder.CreateFCmpOLE(left, right);
    } else if (op === '>') {
        return ir.builder.CreateFCmpOGT(left, right);
    } else if (op === '>=') {
        return ir.builder.CreateFCmpOGE(left, right);
    } else if (op === '==') {
        return ir.builder.CreateFCmpOEQ(left, right);
    } else if (op === '!=') {
        return ir.builder.CreateFCmpONE(left, right);
    }

    if (op === 'and') {
        return ir.builder.CreateAnd(left, right);
    } else if (op === 'or') {
        return ir.builder.CreateOr(left, right);
    }

    throw new Error(`LLVM IR generation: No operator '${op}'.`);
}

export function generateMemberCall(ir: IR, di: DI, expr: MemberCall): llvm.Value {
    const member = expr.element.ref!;
    ir.builder.SetCurrentDebugLocation(getDILocation(ir, di, expr));
    
    if (isFunctionDeclaration(member)) {
        const func = ir.module.getFunction(member.name);
        if (func) {
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
