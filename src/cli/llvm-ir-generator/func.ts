import llvm from "llvm-bindings";
import { FunctionDeclaration } from "../../language/generated/ast.js";
import { DI, IR, getPos, getCurrScope } from "./util.js";
import { generateBlock } from "./block.js";

export function generateFunction(ir: IR, di: DI, funcDecl: FunctionDeclaration) {
    const { name, parameters, returnType, body } = funcDecl;
    const { line } = getPos(funcDecl);
    const signature = getSignature(funcDecl);

    const funcReturnType = ir.basicTypes.get(returnType.primitive)!;
    const funcParamTypes = parameters.map(p => ir.basicTypes.get(p.type.primitive)!);
    const funcType = llvm.FunctionType.get(funcReturnType, funcParamTypes, false);
    const func = llvm.Function.Create(funcType, llvm.Function.LinkageTypes.ExternalLinkage, name, ir.module);

    const debugInfoParamTypes = di.builder.getOrCreateTypeArray(signature.map(t => di.basicTypes.get(t.primitive)!));
    const debugInfoSubroutineType = di.builder.createSubroutineType(debugInfoParamTypes);
    const debugInfoFuncSubprogram = di.builder.createFunction(
        getCurrScope(di), name, '', di.file, line,
        debugInfoSubroutineType, line, llvm.DINode.DIFlags.FlagPrototyped, llvm.DISubprogram.DISPFlags.SPFlagDefinition
    );

    func.setSubprogram(debugInfoFuncSubprogram);
    ir.builder.SetCurrentDebugLocation(new llvm.DebugLoc());

    di.scope.push(debugInfoFuncSubprogram);

    const entryBB = llvm.BasicBlock.Create(ir.context, 'entry', func);
    ir.builder.SetInsertPoint(entryBB);

    generateBlock(ir, di, body.elements, { func, inputVars: parameters });
    // if the return type is not void, the return statement was generated in the `generateBlock`
    if (funcDecl.returnType.primitive === 'void') {
        generateReturnVoid(ir, di, funcDecl);
    }

    di.scope.pop();

    di.builder.finalizeSubprogram(debugInfoFuncSubprogram);
    if (llvm.verifyFunction(func)) {
        console.error(`Verifying the ${name} function failed`);
    }
}

function generateReturnVoid(ir: IR, di: DI, funcDecl: FunctionDeclaration) {
    // generates an artificial `return 0` statement if ;
    // it's not represented in the source code, and debugging points on a non-existing line
    const { line: retLine, character: retCol } = funcDecl.$cstNode?.range.end!;
    ir.builder.SetCurrentDebugLocation(llvm.DILocation.get(ir.context, retLine, retCol, getCurrScope(di)));
    ir.builder.CreateRetVoid();
}

function getSignature({ parameters, returnType }: FunctionDeclaration) {
    const signature = parameters.map(p => p.type);
    signature.push(returnType);
    return signature;
}
