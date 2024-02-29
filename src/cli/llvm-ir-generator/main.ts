import { isVariableDeclaration, VariableDeclaration, type OxProgram, TypeReference, Expression, isBooleanExpression, isNumberExpression } from '../../language/generated/ast.js';
import llvm from 'llvm-bindings';
import { AstNode } from 'langium';
import { Position } from 'vscode-languageclient';

export function generateLLVMIR(program: OxProgram, filename: string, dbg: boolean = true): string {
    const context = new llvm.LLVMContext();
    const module = new llvm.Module(filename, context);
    const builder = new llvm.IRBuilder(context);

    module.addModuleFlag(llvm.Module.ModFlagBehavior.Warning, 'Debug Info Version', llvm.LLVMConstants.DEBUG_METADATA_VERSION);
    module.addModuleFlag(llvm.Module.ModFlagBehavior.Warning, 'Dwarf Version', llvm.dwarf.LLVMConstants.DWARF_VERSION);
    const debugInfoBuilder = new llvm.DIBuilder(module);
    const debugInfoFile = debugInfoBuilder.createFile(filename, '.');
    const debugInfoUnit = debugInfoBuilder.createCompileUnit(llvm.dwarf.SourceLanguage.DW_LANG_C, debugInfoFile, 'Ox compiler', false, '', 0);

    const vars = program.elements.filter(e => isVariableDeclaration(e)) as VariableDeclaration[];
    createMainFunc(context, module, builder, debugInfoBuilder, debugInfoFile, debugInfoUnit, vars);

    debugInfoBuilder.finalize();

    if (llvm.verifyModule(module)) {
        console.error(`${filename}: verifying the module failed`);
        process.exit(1);
    }

    return module.print();
}

function createMainFunc(
    context: llvm.LLVMContext,
    module: llvm.Module,
    builder: llvm.IRBuilder,
    debugInfoBuilder: llvm.DIBuilder,
    debugInfoFile: llvm.DIFile,
    debugInfoUnit: llvm.DICompileUnit,
    varDecls: VariableDeclaration[]): llvm.Function {

    const debugInfoBasicTypeInt = debugInfoBuilder.createBasicType('int', 32, llvm.dwarf.TypeKind.DW_ATE_float);

    const mainFuncReturnType = builder.getInt32Ty();
    const mainFuncType = llvm.FunctionType.get(mainFuncReturnType, false);
    const mainFunc = llvm.Function.Create(mainFuncType, llvm.Function.LinkageTypes.ExternalLinkage, 'main', module);
    const debugInfoParamTypes = debugInfoBuilder.getOrCreateTypeArray([debugInfoBasicTypeInt]);
    const debugInfoSubroutineType = debugInfoBuilder.createSubroutineType(debugInfoParamTypes);
    const debugInfoMainFuncSubprogram = debugInfoBuilder.createFunction(
        debugInfoFile, 'main', '', debugInfoFile, 1,
        debugInfoSubroutineType, 1, llvm.DINode.DIFlags.FlagPrototyped, llvm.DISubprogram.DISPFlags.SPFlagDefinition
    );

    mainFunc.setSubprogram(debugInfoMainFuncSubprogram);
    builder.SetCurrentDebugLocation(new llvm.DebugLoc());

    const entryBB = llvm.BasicBlock.Create(context, 'entry', mainFunc);
    builder.SetInsertPoint(entryBB);

    for (const varDecl of varDecls) {
        const { name, type, assignment, value: expr } = varDecl;
        const { irType, diType } = getType(builder, debugInfoBuilder, type);
        let { line, character: col } = getLoc(varDecl);

        const alloca = builder.CreateAlloca(irType, null, name);
        const diLocalVar = debugInfoBuilder.createAutoVariable(debugInfoMainFuncSubprogram, name, debugInfoFile, line, diType);

        debugInfoBuilder.insertDeclare(
            alloca,
            diLocalVar,
            debugInfoBuilder.createExpression(),
            llvm.DILocation.get(context, line, col, debugInfoMainFuncSubprogram),
            builder.GetInsertBlock()!
        );

        builder.SetCurrentDebugLocation(llvm.DILocation.get(context, line, col, debugInfoMainFuncSubprogram));

        if (assignment) {
            builder.CreateStore(getValue(builder, expr!), alloca);
        }
    }

    builder.SetCurrentDebugLocation(llvm.DILocation.get(context, 9, 5, debugInfoMainFuncSubprogram));
    builder.CreateRet(builder.getInt32(0));

    debugInfoBuilder.finalizeSubprogram(debugInfoMainFuncSubprogram);
    if (llvm.verifyFunction(mainFunc)) {
        console.error(`Verifying the 'main' function failed`);
    }
    return mainFunc;
}

type LLVMType = {
    irType: llvm.Type,
    diType: llvm.DIBasicType
};

function getLoc(node: AstNode): Position {
    const pos = node.$cstNode!.range.start;
    return {
        line: pos.line + 1,
        character: pos.character
    };
}

function getValue(builder: llvm.IRBuilder, expr: Expression): llvm.Value {
    if (isNumberExpression(expr)) {
        return llvm.ConstantFP.get(builder.getDoubleTy(), expr.value);
    } else if (isBooleanExpression(expr)) {
        return builder.getInt1(expr.value);
    }
    console.error(`Expression '${expr.$cstNode?.text}' is not supported.`);
    process.exit(1);
}

function getType(builder: llvm.IRBuilder, diBuilder: llvm.DIBuilder, { primitive }: TypeReference): LLVMType {
    if (primitive === "number") {
        return {
            irType: builder.getDoubleTy(),
            diType: diBuilder.createBasicType('double', 64, llvm.dwarf.TypeKind.DW_ATE_float)
        };
    } else if (primitive === "boolean") {
        return {
            irType: builder.getInt1Ty(),
            diType: diBuilder.createBasicType('boolean', 8, llvm.dwarf.TypeKind.DW_ATE_boolean)
        };
    }
    console.error(`Type '${primitive}' is not supported.`);
    process.exit(1);
}
