import llvm from "llvm-bindings";
import { FunctionDeclaration } from "../../language/generated/ast.js";
import { DI, IR, getLoc, getScope } from "./util.js";
import { generateExpressionBlock } from "./block.js";

export function generateFunction(ir: IR, di: DI, funcDecl: FunctionDeclaration) {
    const { name, parameters, returnType, body } = funcDecl;
    const { line } = getLoc(funcDecl);
    const signature = parameters.map(p => p.type);
    signature.push(returnType);

    const funcReturnType = ir.basicTypes.get(returnType.primitive)!;
    const funcParamTypes = parameters.map(p => ir.basicTypes.get(p.type.primitive)!);
    const funcType = llvm.FunctionType.get(funcReturnType, funcParamTypes, false);
    const func = llvm.Function.Create(funcType, llvm.Function.LinkageTypes.ExternalLinkage, name, ir.module);

    const debugInfoParamTypes = di.builder.getOrCreateTypeArray(signature.map(t => di.basicTypes.get(t.primitive)!));
    const debugInfoSubroutineType = di.builder.createSubroutineType(debugInfoParamTypes);
    const debugInfoFuncSubprogram = di.builder.createFunction(
        getScope(di), name, '', di.file, line,
        debugInfoSubroutineType, line, llvm.DINode.DIFlags.FlagPrototyped, llvm.DISubprogram.DISPFlags.SPFlagDefinition
    );

    di.scope.push(debugInfoFuncSubprogram);

    func.setSubprogram(debugInfoFuncSubprogram);
    ir.builder.SetCurrentDebugLocation(new llvm.DebugLoc());

    generateExpressionBlock(ir, di, body.elements, { name: 'entry', func, inputVars: parameters });

    di.scope.pop();

    di.builder.finalizeSubprogram(debugInfoFuncSubprogram);
    if (llvm.verifyFunction(func)) {
        console.error(`Verifying the ${name} function failed`);
    }
    return func;
}
