import llvm from 'llvm-bindings';
import { DI, IR } from './util.js';

export function initDITypes(di: DI) {
    di.basicTypes.set('int',     di.builder.createBasicType('int', 32, llvm.dwarf.TypeKind.DW_ATE_signed));
    di.basicTypes.set('boolean', di.builder.createBasicType('boolean', 8, llvm.dwarf.TypeKind.DW_ATE_boolean));
    di.basicTypes.set('number',  di.builder.createBasicType('double', 64, llvm.dwarf.TypeKind.DW_ATE_float));
    // todo: review the solution to use `llvm.dwarf.TypeKind.DW_ATE_boolean` here
    di.basicTypes.set('void',    di.builder.createBasicType('void', 0, llvm.dwarf.TypeKind.DW_ATE_boolean));
}

export function initIRTypes(ir: IR) {
    ir.basicTypes.set('int',     ir.builder.getInt32Ty());
    ir.basicTypes.set('boolean', ir.builder.getInt1Ty());
    ir.basicTypes.set('number',  ir.builder.getDoubleTy());
    ir.basicTypes.set('void',    ir.builder.getVoidTy());
}
