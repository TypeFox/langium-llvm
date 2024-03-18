; ModuleID = '/Users/irina/Developer/langium-llvm/examples/factorial.ox'
source_filename = "/Users/irina/Developer/langium-llvm/examples/factorial.ox"

@float_modifier = private unnamed_addr constant [4 x i8] c"%f\0A\00", align 1
@integer_modifier = private unnamed_addr constant [4 x i8] c"%i\0A\00", align 1

declare i32 @printf(i8*, ...)

declare double @pow(double, double, ...)

define double @fact(double %0) !dbg !4 {
entry:
  %n = alloca double, align 8
  store double %0, double* %n, align 8
  call void @llvm.dbg.declare(metadata double* %n, metadata !9, metadata !DIExpression()), !dbg !10
  %res = alloca double, align 8
  call void @llvm.dbg.declare(metadata double* %res, metadata !11, metadata !DIExpression()), !dbg !12
  store double 1.000000e+00, double* %res, align 8, !dbg !13
  %i = alloca double, align 8, !dbg !13
  call void @llvm.dbg.declare(metadata double* %i, metadata !14, metadata !DIExpression()), !dbg !15
  store double 2.000000e+00, double* %i, align 8, !dbg !16
  br label %whilecond, !dbg !16

whilecond:                                        ; preds = %loop, %entry
  %1 = load double, double* %i, align 8, !dbg !17
  %2 = load double, double* %n, align 8, !dbg !18
  %3 = fcmp ole double %1, %2, !dbg !18
  br i1 %3, label %loop, label %whileend, !dbg !18

loop:                                             ; preds = %whilecond
  %4 = load double, double* %res, align 8, !dbg !19
  %5 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @float_modifier, i32 0, i32 0), double %4), !dbg !20
  %6 = load double, double* %res, align 8, !dbg !21
  %7 = load double, double* %i, align 8, !dbg !22
  %8 = fmul double %6, %7, !dbg !22
  store double %8, double* %res, align 8, !dbg !22
  %9 = load double, double* %i, align 8, !dbg !23
  %10 = fadd double %9, 1.000000e+00, !dbg !24
  store double %10, double* %i, align 8, !dbg !24
  br label %whilecond, !dbg !24

whileend:                                         ; preds = %whilecond
  %11 = load double, double* %res, align 8, !dbg !25
  ret double %11, !dbg !26
}

; Function Attrs: nofree nosync nounwind readnone speculatable willreturn
declare void @llvm.dbg.declare(metadata, metadata, metadata) #0

define i32 @main() !dbg !27 {
entry:
  %0 = call double @fact(double 5.000000e+00), !dbg !31
  %1 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @float_modifier, i32 0, i32 0), double %0), !dbg !32
  ret i32 0, !dbg !33
}

attributes #0 = { nofree nosync nounwind readnone speculatable willreturn }

!llvm.module.flags = !{!0, !1}
!llvm.dbg.cu = !{!2}

!0 = !{i32 2, !"Debug Info Version", i32 3}
!1 = !{i32 2, !"Dwarf Version", i32 4}
!2 = distinct !DICompileUnit(language: DW_LANG_C, file: !3, producer: "Ox compiler", isOptimized: false, runtimeVersion: 0, emissionKind: FullDebug)
!3 = !DIFile(filename: "/Users/irina/Developer/langium-llvm/examples/factorial.ox", directory: ".")
!4 = distinct !DISubprogram(name: "fact", scope: !3, file: !3, line: 1, type: !5, scopeLine: 1, flags: DIFlagPrototyped, spFlags: DISPFlagDefinition, unit: !2, retainedNodes: !8)
!5 = !DISubroutineType(types: !6)
!6 = !{!7, !7}
!7 = !DIBasicType(name: "double", size: 64, encoding: DW_ATE_float)
!8 = !{}
!9 = !DILocalVariable(name: "n", arg: 1, scope: !4, file: !3, line: 1, type: !7)
!10 = !DILocation(line: 1, column: 9, scope: !4)
!11 = !DILocalVariable(name: "res", scope: !4, file: !3, line: 2, type: !7)
!12 = !DILocation(line: 2, column: 4, scope: !4)
!13 = !DILocation(line: 2, column: 22, scope: !4)
!14 = !DILocalVariable(name: "i", scope: !4, file: !3, line: 3, type: !7)
!15 = !DILocation(line: 3, column: 9, scope: !4)
!16 = !DILocation(line: 3, column: 25, scope: !4)
!17 = !DILocation(line: 3, column: 28, scope: !4)
!18 = !DILocation(line: 3, column: 33, scope: !4)
!19 = !DILocation(line: 4, column: 14, scope: !4)
!20 = !DILocation(line: 4, column: 8, scope: !4)
!21 = !DILocation(line: 5, column: 14, scope: !4)
!22 = !DILocation(line: 5, column: 20, scope: !4)
!23 = !DILocation(line: 3, column: 40, scope: !4)
!24 = !DILocation(line: 3, column: 44, scope: !4)
!25 = !DILocation(line: 7, column: 11, scope: !4)
!26 = !DILocation(line: 7, column: 4, scope: !4)
!27 = distinct !DISubprogram(name: "main", scope: !3, file: !3, line: 1, type: !28, scopeLine: 1, flags: DIFlagPrototyped, spFlags: DISPFlagDefinition, unit: !2, retainedNodes: !8)
!28 = !DISubroutineType(types: !29)
!29 = !{!30}
!30 = !DIBasicType(name: "int", size: 32, encoding: DW_ATE_signed)
!31 = !DILocation(line: 10, column: 11, scope: !27)
!32 = !DILocation(line: 10, scope: !27)
!33 = !DILocation(line: 10, column: 1, scope: !27)
