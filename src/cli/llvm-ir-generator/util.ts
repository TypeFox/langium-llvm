import { AstNode } from 'langium';
import llvm from 'llvm-bindings';
import { Position } from 'vscode-languageclient';

export type IR = {
    context: llvm.LLVMContext,
    module: llvm.Module,
    builder: llvm.IRBuilder,
    basicTypes: Map<string, llvm.Type>,
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
    return { context, module, builder, basicTypes: new Map() };
}

export function initDI(ir: IR, filename: string): DI {
    ir.module.addModuleFlag(llvm.Module.ModFlagBehavior.Warning, 'Debug Info Version', llvm.LLVMConstants.DEBUG_METADATA_VERSION);
    ir.module.addModuleFlag(llvm.Module.ModFlagBehavior.Warning, 'Dwarf Version', llvm.dwarf.LLVMConstants.DWARF_VERSION);
    const builder = new llvm.DIBuilder(ir.module);
    const file = builder.createFile(filename, '.');
    const unit = builder.createCompileUnit(llvm.dwarf.SourceLanguage.DW_LANG_C, file, 'Ox compiler', false, '', 0);
    const scope = [file];
    return { builder, file, unit, scope, basicTypes: new Map() };
}

export function getLoc(node: AstNode): Position {
    const pos = node.$cstNode!.range.start;
    return {
        line: pos.line + 1,
        character: pos.character
    };
}
