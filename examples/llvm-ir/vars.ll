; ModuleID = 'examples/vars.ox'
source_filename = "examples/vars.ox"

@float_modifier = private unnamed_addr constant [4 x i8] c"%f\0A\00", align 1
@integer_modifier = private unnamed_addr constant [4 x i8] c"%i\0A\00", align 1

declare i32 @printf(i8*, ...)

declare double @pow(double, double, ...)

define double @returnSum(double %0, double %1) !dbg !4 {
entry:
  %a = alloca double, align 8
  store double %0, double* %a, align 8
  call void @llvm.dbg.declare(metadata double* %a, metadata !9, metadata !DIExpression()), !dbg !10
  %b = alloca double, align 8
  store double %1, double* %b, align 8
  call void @llvm.dbg.declare(metadata double* %b, metadata !11, metadata !DIExpression()), !dbg !12
  %2 = load double, double* %a, align 8, !dbg !13
  %3 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @float_modifier, i32 0, i32 0), double %2), !dbg !14
  %4 = load double, double* %a, align 8, !dbg !15
  %5 = load double, double* %b, align 8, !dbg !16
  %6 = fadd double %4, %5, !dbg !16
  ret double %6, !dbg !17
}

; Function Attrs: nofree nosync nounwind readnone speculatable willreturn
declare void @llvm.dbg.declare(metadata, metadata, metadata) #0

define i32 @main() !dbg !18 {
entry:
  %x = alloca double, align 8
  call void @llvm.dbg.declare(metadata double* %x, metadata !22, metadata !DIExpression()), !dbg !23
  store double 1.200000e+01, double* %x, align 8, !dbg !24
  %y = alloca double, align 8, !dbg !24
  call void @llvm.dbg.declare(metadata double* %y, metadata !25, metadata !DIExpression()), !dbg !26
  store double 3.232000e+01, double* %y, align 8, !dbg !27
  %z = alloca i1, align 1, !dbg !27
  call void @llvm.dbg.declare(metadata i1* %z, metadata !28, metadata !DIExpression()), !dbg !30
  store i1 true, i1* %z, align 1, !dbg !31
  %w = alloca double, align 8, !dbg !31
  call void @llvm.dbg.declare(metadata double* %w, metadata !32, metadata !DIExpression()), !dbg !33
  store double 0.000000e+00, double* %w, align 8, !dbg !34
  %a = alloca i1, align 1, !dbg !34
  call void @llvm.dbg.declare(metadata i1* %a, metadata !35, metadata !DIExpression()), !dbg !36
  store i1 false, i1* %a, align 1, !dbg !37
  %xx = alloca double, align 8, !dbg !37
  call void @llvm.dbg.declare(metadata double* %xx, metadata !38, metadata !DIExpression()), !dbg !39
  %0 = call double @returnSum(double 2.000000e+00, double 3.000000e+00), !dbg !40
  store double %0, double* %xx, align 8, !dbg !40
  %1 = load double, double* %xx, align 8, !dbg !41
  %2 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @float_modifier, i32 0, i32 0), double %1), !dbg !42
  ret i32 0, !dbg !43
}

attributes #0 = { nofree nosync nounwind readnone speculatable willreturn }

!llvm.module.flags = !{!0, !1}
!llvm.dbg.cu = !{!2}

!0 = !{i32 2, !"Debug Info Version", i32 3}
!1 = !{i32 2, !"Dwarf Version", i32 4}
!2 = distinct !DICompileUnit(language: DW_LANG_C, file: !3, producer: "Ox compiler", isOptimized: false, runtimeVersion: 0, emissionKind: FullDebug)
!3 = !DIFile(filename: "examples/vars.ox", directory: ".")
!4 = distinct !DISubprogram(name: "returnSum", scope: !3, file: !3, line: 7, type: !5, scopeLine: 7, flags: DIFlagPrototyped, spFlags: DISPFlagDefinition, unit: !2, retainedNodes: !8)
!5 = !DISubroutineType(types: !6)
!6 = !{!7, !7, !7}
!7 = !DIBasicType(name: "double", size: 64, encoding: DW_ATE_float)
!8 = !{}
!9 = !DILocalVariable(name: "a", arg: 1, scope: !4, file: !3, line: 7, type: !7)
!10 = !DILocation(line: 7, column: 14, scope: !4)
!11 = !DILocalVariable(name: "b", arg: 2, scope: !4, file: !3, line: 7, type: !7)
!12 = !DILocation(line: 7, column: 25, scope: !4)
!13 = !DILocation(line: 8, column: 10, scope: !4)
!14 = !DILocation(line: 8, column: 4, scope: !4)
!15 = !DILocation(line: 9, column: 11, scope: !4)
!16 = !DILocation(line: 9, column: 15, scope: !4)
!17 = !DILocation(line: 9, column: 4, scope: !4)
!18 = distinct !DISubprogram(name: "main", scope: !3, file: !3, line: 1, type: !19, scopeLine: 1, flags: DIFlagPrototyped, spFlags: DISPFlagDefinition, unit: !2, retainedNodes: !8)
!19 = !DISubroutineType(types: !20)
!20 = !{!21}
!21 = !DIBasicType(name: "int", size: 32, encoding: DW_ATE_signed)
!22 = !DILocalVariable(name: "x", scope: !18, file: !3, line: 1, type: !7)
!23 = !DILocation(line: 1, scope: !18)
!24 = !DILocation(line: 1, column: 16, scope: !18)
!25 = !DILocalVariable(name: "y", scope: !18, file: !3, line: 2, type: !7)
!26 = !DILocation(line: 2, scope: !18)
!27 = !DILocation(line: 2, column: 16, scope: !18)
!28 = !DILocalVariable(name: "z", scope: !18, file: !3, line: 3, type: !29)
!29 = !DIBasicType(name: "boolean", size: 8, encoding: DW_ATE_boolean)
!30 = !DILocation(line: 3, scope: !18)
!31 = !DILocation(line: 3, column: 17, scope: !18)
!32 = !DILocalVariable(name: "w", scope: !18, file: !3, line: 4, type: !7)
!33 = !DILocation(line: 4, scope: !18)
!34 = !DILocation(line: 4, column: 16, scope: !18)
!35 = !DILocalVariable(name: "a", scope: !18, file: !3, line: 5, type: !29)
!36 = !DILocation(line: 5, scope: !18)
!37 = !DILocation(line: 5, column: 17, scope: !18)
!38 = !DILocalVariable(name: "xx", scope: !18, file: !3, line: 12, type: !7)
!39 = !DILocation(line: 12, scope: !18)
!40 = !DILocation(line: 12, column: 30, scope: !18)
!41 = !DILocation(line: 13, column: 6, scope: !18)
!42 = !DILocation(line: 13, scope: !18)
!43 = !DILocation(line: 13, column: 1, scope: !18)
