import { FunctionDeclaration, isFunctionDeclaration, type OxProgram } from '../../language/generated/ast.js';
import llvm from 'llvm-bindings';
import { DI, IR, initDI, initIR, setupExternFunctions } from './util.js';
import { generateExpressionBlock } from './block.js';
import { initDITypes, initIRTypes } from './type.js';
import { generateFunction } from './func.js';

export function generateLLVMIR(program: OxProgram, filename: string): string {
    const ir = initIR(filename);
    initIRTypes(ir);
    setupExternFunctions(ir);
    
    const di = initDI(ir, filename, 'Ox compiler');
    initDITypes(di);

    const funcs = program.elements.filter(e => isFunctionDeclaration(e)) as FunctionDeclaration[];
    funcs.forEach(func => generateFunction(ir, di, func));

    generateMainFunc(ir, di, program);

    di.builder.finalize();
    if (llvm.verifyModule(ir.module)) {
        console.error(`${filename}: verifying the module failed`);
        process.exit(1);
    }

    return ir.module.print();
}

function generateMainFunc(ir: IR, di: DI, program: OxProgram) {
    const mainFuncReturnType = ir.builder.getInt32Ty();
    const mainFuncType = llvm.FunctionType.get(mainFuncReturnType, false);
    const mainFunc = llvm.Function.Create(mainFuncType, llvm.Function.LinkageTypes.ExternalLinkage, 'main', ir.module);
 
    const debugInfoParamTypes = di.builder.getOrCreateTypeArray([di.basicTypes.get('int')!]);
    const debugInfoSubroutineType = di.builder.createSubroutineType(debugInfoParamTypes);
    const debugInfoMainFuncSubprogram = di.builder.createFunction(
        di.file, 'main', '', di.file, 1,
        debugInfoSubroutineType, 1, llvm.DINode.DIFlags.FlagPrototyped, llvm.DISubprogram.DISPFlags.SPFlagDefinition
    );

    mainFunc.setSubprogram(debugInfoMainFuncSubprogram);
    ir.builder.SetCurrentDebugLocation(new llvm.DebugLoc());

    di.scope.push(debugInfoMainFuncSubprogram);

    generateExpressionBlock(ir, di,
        program.elements.filter(e => !isFunctionDeclaration(e)),
        { name: 'entry', func: mainFunc }
    );

    // generates an artificial `return 0` statement;
    // it's not represented in the source code, and debugging points on a non-existing line
    const endLine = program.$cstNode?.range.end.line! + 2;
    ir.builder.SetCurrentDebugLocation(llvm.DILocation.get(ir.context, endLine, 1, debugInfoMainFuncSubprogram));
    ir.builder.CreateRet(ir.builder.getInt32(0));

    di.scope.pop();

    di.builder.finalizeSubprogram(debugInfoMainFuncSubprogram);
    if (llvm.verifyFunction(mainFunc)) {
        console.error(`Verifying the 'main' function failed`);
    }
}
