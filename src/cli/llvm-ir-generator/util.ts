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

export function setupExternFunctions(ir: IR) {
    const float_modifier_name = 'float_modifier';
    const float_modifier = ir.builder.CreateGlobalStringPtr('%f\n', float_modifier_name, 0, ir.module);
    ir.globalValues.set(float_modifier_name, float_modifier);

    const integer_modifier_name = 'integer_modifier';
    const integer_modifier = ir.builder.CreateGlobalStringPtr('%i\n', integer_modifier_name, 0, ir.module);
    ir.globalValues.set(integer_modifier_name, integer_modifier);

    const bytePtrTy: llvm.PointerType[] = [ir.builder.getInt8PtrTy()];
    ir.module.getOrInsertFunction('printf', llvm.FunctionType.get(
        /* return type */ ir.builder.getInt32Ty(),
        /* foramt arg */  bytePtrTy,
        /* vararg */      true
    ));

    ir.module.getOrInsertFunction('pow', llvm.FunctionType.get(
        /* return type */ ir.builder.getDoubleTy(),
        /* foramt arg */  [ir.builder.getDoubleTy(), ir.builder.getDoubleTy()],
        /* vararg */      true
    ));
}

export type Loc = {
    line: number,
    col: number
}

export function getLoc(node: AstNode): Loc {
    const pos = node.$cstNode!.range.start;
    return {
        line: pos.line + 1,
        col: pos.character
    };
}

export function getCurrScope(di: DI): llvm.DIScope {
    return di.scope[di.scope.length - 1];
}
