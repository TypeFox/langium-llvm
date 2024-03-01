import { AstNode } from 'langium';
import llvm from 'llvm-bindings';

export type IR = {
    context: llvm.LLVMContext,
    module: llvm.Module,
    builder: llvm.IRBuilder,
    basicTypes: Map<string, llvm.Type>,
    nameToAlloca: Map<string, llvm.AllocaInst>,
    globalValues: Map<string, llvm.Constant>,
}

export type DI = {
    builder: llvm.DIBuilder,
    file: llvm.DIFile,
    unit: llvm.DICompileUnit,
    scope: llvm.DIScope[],
    basicTypes: Map<string, llvm.DIBasicType>,
}

export function initIR(filename: string): IR {
    const context = new llvm.LLVMContext();
    const module = new llvm.Module(filename, context);
    const builder = new llvm.IRBuilder(context);
    return { context, module, builder,
        basicTypes: new Map(),
        nameToAlloca: new Map(),
        globalValues: new Map()
    };
}

export function initDI(ir: IR, filename: string, producer: string): DI {
    ir.module.addModuleFlag(llvm.Module.ModFlagBehavior.Warning, 'Debug Info Version', llvm.LLVMConstants.DEBUG_METADATA_VERSION);
    ir.module.addModuleFlag(llvm.Module.ModFlagBehavior.Warning, 'Dwarf Version', llvm.dwarf.LLVMConstants.DWARF_VERSION);

    const builder = new llvm.DIBuilder(ir.module);
    const file = builder.createFile(filename, '.');
    const unit = builder.createCompileUnit(llvm.dwarf.SourceLanguage.DW_LANG_C, file, producer, false, '', 0);
    return { builder, file, unit,
        scope: [file],
        basicTypes: new Map()
    };
}

export type Pos = {
    line: number,
    col: number
}

export function getLoc(node: AstNode): Pos {
    const pos = node.$cstNode!.range.start;
    return {
        line: pos.line + 1,
        col: pos.character
    };
}

export function getCurrScope(di: DI): llvm.DIScope {
    return di.scope[di.scope.length - 1];
}
