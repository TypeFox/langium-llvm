; ModuleID = '/Users/irina/Developer/langium-llvm/examples/basic.ox'
source_filename = "/Users/irina/Developer/langium-llvm/examples/basic.ox"

@float_modifier = private unnamed_addr constant [4 x i8] c"%f\0A\00", align 1
@integer_modifier = private unnamed_addr constant [4 x i8] c"%i\0A\00", align 1

declare i32 @printf(i8*, ...)

declare double @pow(double, double, ...)

define double @inc(double %0) !dbg !4 {
entry:
  %a = alloca double, align 8
  store double %0, double* %a, align 8
  call void @llvm.dbg.declare(metadata double* %a, metadata !9, metadata !DIExpression()), !dbg !10
  %1 = load double, double* %a, align 8, !dbg !11
  %2 = fadd double %1, 1.000000e+00, !dbg !12
  ret double %2, !dbg !13
}

; Function Attrs: nofree nosync nounwind readnone speculatable willreturn
declare void @llvm.dbg.declare(metadata, metadata, metadata) #0

define void @printSum(double %0, double %1) !dbg !14 {
entry:
  %a = alloca double, align 8
  store double %0, double* %a, align 8
  call void @llvm.dbg.declare(metadata double* %a, metadata !18, metadata !DIExpression()), !dbg !19
  %b = alloca double, align 8
  store double %1, double* %b, align 8
  call void @llvm.dbg.declare(metadata double* %b, metadata !20, metadata !DIExpression()), !dbg !21
  %2 = load double, double* %a, align 8, !dbg !22
  %3 = call double @inc(double %2), !dbg !22
  %4 = load double, double* %b, align 8, !dbg !23
  %5 = call double @inc(double %4), !dbg !23
  %6 = call double @inc(double %5), !dbg !23
  %7 = fadd double %3, %6, !dbg !23
  %8 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @float_modifier, i32 0, i32 0), double %7), !dbg !24
  ret void, !dbg !25
}

define double @returnSum(double %0, double %1) !dbg !26 {
entry:
  %a = alloca double, align 8
  store double %0, double* %a, align 8
  call void @llvm.dbg.declare(metadata double* %a, metadata !29, metadata !DIExpression()), !dbg !30
  %b = alloca double, align 8
  store double %1, double* %b, align 8
  call void @llvm.dbg.declare(metadata double* %b, metadata !31, metadata !DIExpression()), !dbg !32
  %2 = load double, double* %a, align 8, !dbg !33
  %3 = load double, double* %b, align 8, !dbg !34
  %4 = fadd double %2, %3, !dbg !34
  ret double %4, !dbg !35
}

define i32 @main() !dbg !36 {
entry:
  %add = alloca double, align 8
  call void @llvm.dbg.declare(metadata double* %add, metadata !40, metadata !DIExpression()), !dbg !41
  store double 6.400000e+01, double* %add, align 8, !dbg !42
  %subtract = alloca double, align 8, !dbg !42
  call void @llvm.dbg.declare(metadata double* %subtract, metadata !43, metadata !DIExpression()), !dbg !44
  store double 9.000000e+00, double* %subtract, align 8, !dbg !45
  %multiply = alloca double, align 8, !dbg !45
  call void @llvm.dbg.declare(metadata double* %multiply, metadata !46, metadata !DIExpression()), !dbg !47
  store double 5.200000e+01, double* %multiply, align 8, !dbg !48
  %divide = alloca double, align 8, !dbg !48
  call void @llvm.dbg.declare(metadata double* %divide, metadata !49, metadata !DIExpression()), !dbg !50
  store double 3.100000e+01, double* %divide, align 8, !dbg !51
  %fractional = alloca double, align 8, !dbg !51
  call void @llvm.dbg.declare(metadata double* %fractional, metadata !52, metadata !DIExpression()), !dbg !53
  store double 0x4034555555555555, double* %fractional, align 8, !dbg !54
  %negateMe = alloca double, align 8, !dbg !54
  call void @llvm.dbg.declare(metadata double* %negateMe, metadata !55, metadata !DIExpression()), !dbg !56
  %0 = load double, double* %add, align 8, !dbg !57
  %1 = fneg double %0, !dbg !57
  store double %1, double* %negateMe, align 8, !dbg !57
  %less = alloca i1, align 1, !dbg !57
  call void @llvm.dbg.declare(metadata i1* %less, metadata !58, metadata !DIExpression()), !dbg !60
  %2 = load double, double* %add, align 8, !dbg !61
  %3 = load double, double* %subtract, align 8, !dbg !62
  %4 = fcmp olt double %2, %3, !dbg !62
  store i1 %4, i1* %less, align 1, !dbg !62
  %more = alloca i1, align 1, !dbg !62
  call void @llvm.dbg.declare(metadata i1* %more, metadata !63, metadata !DIExpression()), !dbg !64
  %5 = load double, double* %multiply, align 8, !dbg !65
  %6 = load double, double* %divide, align 8, !dbg !66
  %7 = fcmp ogt double %5, %6, !dbg !66
  store i1 %7, i1* %more, align 1, !dbg !66
  %equality = alloca i1, align 1, !dbg !66
  call void @llvm.dbg.declare(metadata i1* %equality, metadata !67, metadata !DIExpression()), !dbg !68
  %8 = load double, double* %add, align 8, !dbg !69
  %9 = load double, double* %subtract, align 8, !dbg !70
  %10 = fcmp oeq double %8, %9, !dbg !70
  store i1 %10, i1* %equality, align 1, !dbg !70
  %inequality = alloca i1, align 1, !dbg !70
  call void @llvm.dbg.declare(metadata i1* %inequality, metadata !71, metadata !DIExpression()), !dbg !72
  %11 = load double, double* %multiply, align 8, !dbg !73
  %12 = load double, double* %divide, align 8, !dbg !74
  %13 = fcmp one double %11, %12, !dbg !74
  store i1 %13, i1* %inequality, align 1, !dbg !74
  %isTrue = alloca i1, align 1, !dbg !74
  call void @llvm.dbg.declare(metadata i1* %isTrue, metadata !75, metadata !DIExpression()), !dbg !76
  store i1 false, i1* %isTrue, align 1, !dbg !77
  %isFalse = alloca i1, align 1, !dbg !77
  call void @llvm.dbg.declare(metadata i1* %isFalse, metadata !78, metadata !DIExpression()), !dbg !79
  store i1 true, i1* %isFalse, align 1, !dbg !80
  %andTrue = alloca i1, align 1, !dbg !80
  call void @llvm.dbg.declare(metadata i1* %andTrue, metadata !81, metadata !DIExpression()), !dbg !82
  %14 = load i1, i1* %isTrue, align 1, !dbg !83
  %15 = load i1, i1* %isFalse, align 1, !dbg !84
  %16 = sub i1 false, %15, !dbg !84
  %17 = and i1 %14, %16, !dbg !84
  store i1 %17, i1* %andTrue, align 1, !dbg !84
  %orFalse = alloca i1, align 1, !dbg !84
  call void @llvm.dbg.declare(metadata i1* %orFalse, metadata !85, metadata !DIExpression()), !dbg !86
  %18 = load i1, i1* %isTrue, align 1, !dbg !87
  %19 = load i1, i1* %isFalse, align 1, !dbg !88
  %20 = or i1 %18, %19, !dbg !88
  %21 = sub i1 false, %20, !dbg !88
  store i1 %21, i1* %orFalse, align 1, !dbg !88
  %min = alloca double, align 8, !dbg !88
  call void @llvm.dbg.declare(metadata double* %min, metadata !89, metadata !DIExpression()), !dbg !90
  store double 1.400000e+01, double* %min, align 8, !dbg !91
  %max = alloca double, align 8, !dbg !91
  call void @llvm.dbg.declare(metadata double* %max, metadata !92, metadata !DIExpression()), !dbg !93
  store double 2.200000e+01, double* %max, align 8, !dbg !94
  %average = alloca double, align 8, !dbg !94
  call void @llvm.dbg.declare(metadata double* %average, metadata !95, metadata !DIExpression()), !dbg !96
  %22 = load double, double* %min, align 8, !dbg !97
  %23 = load double, double* %max, align 8, !dbg !98
  %24 = fadd double %22, %23, !dbg !98
  %25 = fdiv double %24, 2.000000e+00, !dbg !99
  store double %25, double* %average, align 8, !dbg !99
  store double 5.000000e+00, double* %min, align 8, !dbg !100
  %26 = load double, double* %average, align 8, !dbg !101
  %27 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @float_modifier, i32 0, i32 0), double %26), !dbg !102
  %x = alloca i1, align 1, !dbg !102
  call void @llvm.dbg.declare(metadata i1* %x, metadata !103, metadata !DIExpression()), !dbg !104
  store i1 true, i1* %x, align 1, !dbg !105
  %28 = load i1, i1* %x, align 1, !dbg !106
  %29 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @integer_modifier, i32 0, i32 0), i1 %28), !dbg !107
  %x1 = alloca double, align 8, !dbg !107
  call void @llvm.dbg.declare(metadata double* %x1, metadata !108, metadata !DIExpression()), !dbg !109
  store double 1.500000e+01, double* %x1, align 8, !dbg !110
  %30 = load double, double* %x1, align 8, !dbg !111
  %31 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @float_modifier, i32 0, i32 0), double %30), !dbg !112
  %32 = load i1, i1* %x, align 1, !dbg !113
  %33 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @integer_modifier, i32 0, i32 0), i1 %32), !dbg !114
  %34 = load double, double* %average, align 8, !dbg !115
  %35 = fcmp ogt double %34, 5.000000e+00, !dbg !116
  br i1 %35, label %then, label %else3, !dbg !116

then:                                             ; preds = %entry
  %36 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @float_modifier, i32 0, i32 0), double 2.300000e+01), !dbg !117
  %37 = load double, double* %max, align 8, !dbg !118
  %38 = fcmp olt double %37, 3.000000e+01, !dbg !119
  %39 = load double, double* %min, align 8, !dbg !120
  %40 = fcmp ogt double %39, 3.000000e+00, !dbg !121
  %41 = and i1 %38, %40, !dbg !121
  br i1 %41, label %then2, label %else, !dbg !121

then2:                                            ; preds = %then
  %42 = load double, double* %min, align 8, !dbg !122
  %43 = fadd double %42, 1.500000e+01, !dbg !123
  store double %43, double* %min, align 8, !dbg !123
  br label %ifend, !dbg !123

else:                                             ; preds = %then
  br label %ifend, !dbg !123

ifend:                                            ; preds = %else, %then2
  br label %ifend4, !dbg !123

else3:                                            ; preds = %entry
  %44 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @float_modifier, i32 0, i32 0), double -1.200000e+01), !dbg !124
  br label %ifend4, !dbg !124

ifend4:                                           ; preds = %else3, %ifend
  %a = alloca double, align 8, !dbg !124
  call void @llvm.dbg.declare(metadata double* %a, metadata !125, metadata !DIExpression()), !dbg !126
  store double 1.000000e+00, double* %a, align 8, !dbg !127
  br label %whilecond, !dbg !127

whilecond:                                        ; preds = %loop, %ifend4
  %45 = load double, double* %a, align 8, !dbg !128
  %46 = fcmp olt double %45, 1.000000e+01, !dbg !129
  br i1 %46, label %loop, label %whileend, !dbg !129

loop:                                             ; preds = %whilecond
  %47 = load double, double* %a, align 8, !dbg !130
  %48 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @float_modifier, i32 0, i32 0), double %47), !dbg !131
  %49 = load double, double* %a, align 8, !dbg !132
  %50 = fadd double %49, 1.000000e+00, !dbg !133
  store double %50, double* %a, align 8, !dbg !133
  br label %whilecond, !dbg !133

whileend:                                         ; preds = %whilecond
  %i = alloca double, align 8, !dbg !133
  call void @llvm.dbg.declare(metadata double* %i, metadata !134, metadata !DIExpression()), !dbg !135
  store double 1.000000e+00, double* %i, align 8, !dbg !136
  br label %whilecond5, !dbg !136

whilecond5:                                       ; preds = %loop6, %whileend
  %51 = load double, double* %i, align 8, !dbg !137
  %52 = fcmp olt double %51, 1.000000e+01, !dbg !138
  br i1 %52, label %loop6, label %whileend7, !dbg !138

loop6:                                            ; preds = %whilecond5
  %53 = load double, double* %i, align 8, !dbg !139
  %54 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @float_modifier, i32 0, i32 0), double %53), !dbg !140
  %55 = load double, double* %i, align 8, !dbg !141
  %56 = fadd double %55, 1.000000e+00, !dbg !142
  store double %56, double* %i, align 8, !dbg !142
  br label %whilecond5, !dbg !142

whileend7:                                        ; preds = %whilecond5
  call void @printSum(double 3.000000e+00, double 2.000000e+00), !dbg !143
  %57 = call double @returnSum(double 3.230000e+01, double 1.235000e+02), !dbg !144
  %58 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @float_modifier, i32 0, i32 0), double %57), !dbg !145
  ret i32 0, !dbg !146
}

attributes #0 = { nofree nosync nounwind readnone speculatable willreturn }

!llvm.module.flags = !{!0, !1}
!llvm.dbg.cu = !{!2}

!0 = !{i32 2, !"Debug Info Version", i32 3}
!1 = !{i32 2, !"Dwarf Version", i32 4}
!2 = distinct !DICompileUnit(language: DW_LANG_C, file: !3, producer: "Ox compiler", isOptimized: false, runtimeVersion: 0, emissionKind: FullDebug)
!3 = !DIFile(filename: "/Users/irina/Developer/langium-llvm/examples/basic.ox", directory: ".")
!4 = distinct !DISubprogram(name: "inc", scope: !3, file: !3, line: 87, type: !5, scopeLine: 87, flags: DIFlagPrototyped, spFlags: DISPFlagDefinition, unit: !2, retainedNodes: !8)
!5 = !DISubroutineType(types: !6)
!6 = !{!7, !7}
!7 = !DIBasicType(name: "double", size: 64, encoding: DW_ATE_float)
!8 = !{}
!9 = !DILocalVariable(name: "a", arg: 1, scope: !4, file: !3, line: 87, type: !7)
!10 = !DILocation(line: 87, column: 8, scope: !4)
!11 = !DILocation(line: 88, column: 11, scope: !4)
!12 = !DILocation(line: 88, column: 15, scope: !4)
!13 = !DILocation(line: 88, column: 4, scope: !4)
!14 = distinct !DISubprogram(name: "printSum", scope: !3, file: !3, line: 92, type: !15, scopeLine: 92, flags: DIFlagPrototyped, spFlags: DISPFlagDefinition, unit: !2, retainedNodes: !8)
!15 = !DISubroutineType(types: !16)
!16 = !{!7, !7, !17}
!17 = !DIBasicType(name: "void", encoding: DW_ATE_boolean)
!18 = !DILocalVariable(name: "a", arg: 1, scope: !14, file: !3, line: 92, type: !7)
!19 = !DILocation(line: 92, column: 13, scope: !14)
!20 = !DILocalVariable(name: "b", arg: 2, scope: !14, file: !3, line: 92, type: !7)
!21 = !DILocation(line: 92, column: 24, scope: !14)
!22 = !DILocation(line: 93, column: 14, scope: !14)
!23 = !DILocation(line: 93, column: 27, scope: !14)
!24 = !DILocation(line: 93, column: 4, scope: !14)
!25 = !DILocation(line: 93, column: 1, scope: !14)
!26 = distinct !DISubprogram(name: "returnSum", scope: !3, file: !3, line: 96, type: !27, scopeLine: 96, flags: DIFlagPrototyped, spFlags: DISPFlagDefinition, unit: !2, retainedNodes: !8)
!27 = !DISubroutineType(types: !28)
!28 = !{!7, !7, !7}
!29 = !DILocalVariable(name: "a", arg: 1, scope: !26, file: !3, line: 96, type: !7)
!30 = !DILocation(line: 96, column: 14, scope: !26)
!31 = !DILocalVariable(name: "b", arg: 2, scope: !26, file: !3, line: 96, type: !7)
!32 = !DILocation(line: 96, column: 25, scope: !26)
!33 = !DILocation(line: 97, column: 11, scope: !26)
!34 = !DILocation(line: 97, column: 15, scope: !26)
!35 = !DILocation(line: 97, column: 4, scope: !26)
!36 = distinct !DISubprogram(name: "main", scope: !3, file: !3, line: 1, type: !37, scopeLine: 1, flags: DIFlagPrototyped, spFlags: DISPFlagDefinition, unit: !2, retainedNodes: !8)
!37 = !DISubroutineType(types: !38)
!38 = !{!39}
!39 = !DIBasicType(name: "int", size: 32, encoding: DW_ATE_signed)
!40 = !DILocalVariable(name: "add", scope: !36, file: !3, line: 17, type: !7)
!41 = !DILocation(line: 17, scope: !36)
!42 = !DILocation(line: 17, column: 23, scope: !36)
!43 = !DILocalVariable(name: "subtract", scope: !36, file: !3, line: 18, type: !7)
!44 = !DILocation(line: 18, scope: !36)
!45 = !DILocation(line: 18, column: 28, scope: !36)
!46 = !DILocalVariable(name: "multiply", scope: !36, file: !3, line: 19, type: !7)
!47 = !DILocation(line: 19, scope: !36)
!48 = !DILocation(line: 19, column: 28, scope: !36)
!49 = !DILocalVariable(name: "divide", scope: !36, file: !3, line: 20, type: !7)
!50 = !DILocation(line: 20, scope: !36)
!51 = !DILocation(line: 20, column: 26, scope: !36)
!52 = !DILocalVariable(name: "fractional", scope: !36, file: !3, line: 21, type: !7)
!53 = !DILocation(line: 21, scope: !36)
!54 = !DILocation(line: 21, column: 30, scope: !36)
!55 = !DILocalVariable(name: "negateMe", scope: !36, file: !3, line: 23, type: !7)
!56 = !DILocation(line: 23, scope: !36)
!57 = !DILocation(line: 23, column: 24, scope: !36)
!58 = !DILocalVariable(name: "less", scope: !36, file: !3, line: 26, type: !59)
!59 = !DIBasicType(name: "boolean", size: 8, encoding: DW_ATE_boolean)
!60 = !DILocation(line: 26, scope: !36)
!61 = !DILocation(line: 26, column: 20, scope: !36)
!62 = !DILocation(line: 26, column: 26, scope: !36)
!63 = !DILocalVariable(name: "more", scope: !36, file: !3, line: 27, type: !59)
!64 = !DILocation(line: 27, scope: !36)
!65 = !DILocation(line: 27, column: 20, scope: !36)
!66 = !DILocation(line: 27, column: 31, scope: !36)
!67 = !DILocalVariable(name: "equality", scope: !36, file: !3, line: 29, type: !59)
!68 = !DILocation(line: 29, scope: !36)
!69 = !DILocation(line: 29, column: 24, scope: !36)
!70 = !DILocation(line: 29, column: 31, scope: !36)
!71 = !DILocalVariable(name: "inequality", scope: !36, file: !3, line: 30, type: !59)
!72 = !DILocation(line: 30, scope: !36)
!73 = !DILocation(line: 30, column: 26, scope: !36)
!74 = !DILocation(line: 30, column: 38, scope: !36)
!75 = !DILocalVariable(name: "isTrue", scope: !36, file: !3, line: 33, type: !59)
!76 = !DILocation(line: 33, scope: !36)
!77 = !DILocation(line: 33, column: 23, scope: !36)
!78 = !DILocalVariable(name: "isFalse", scope: !36, file: !3, line: 34, type: !59)
!79 = !DILocation(line: 34, scope: !36)
!80 = !DILocation(line: 34, column: 24, scope: !36)
!81 = !DILocalVariable(name: "andTrue", scope: !36, file: !3, line: 37, type: !59)
!82 = !DILocation(line: 37, scope: !36)
!83 = !DILocation(line: 37, column: 23, scope: !36)
!84 = !DILocation(line: 37, column: 35, scope: !36)
!85 = !DILocalVariable(name: "orFalse", scope: !36, file: !3, line: 38, type: !59)
!86 = !DILocation(line: 38, scope: !36)
!87 = !DILocation(line: 38, column: 24, scope: !36)
!88 = !DILocation(line: 38, column: 34, scope: !36)
!89 = !DILocalVariable(name: "min", scope: !36, file: !3, line: 41, type: !7)
!90 = !DILocation(line: 41, scope: !36)
!91 = !DILocation(line: 41, column: 18, scope: !36)
!92 = !DILocalVariable(name: "max", scope: !36, file: !3, line: 42, type: !7)
!93 = !DILocation(line: 42, scope: !36)
!94 = !DILocation(line: 42, column: 18, scope: !36)
!95 = !DILocalVariable(name: "average", scope: !36, file: !3, line: 43, type: !7)
!96 = !DILocation(line: 43, scope: !36)
!97 = !DILocation(line: 43, column: 23, scope: !36)
!98 = !DILocation(line: 43, column: 29, scope: !36)
!99 = !DILocation(line: 43, column: 36, scope: !36)
!100 = !DILocation(line: 47, column: 6, scope: !36)
!101 = !DILocation(line: 50, column: 6, scope: !36)
!102 = !DILocation(line: 50, scope: !36)
!103 = !DILocalVariable(name: "x", scope: !36, file: !3, line: 52, type: !59)
!104 = !DILocation(line: 52, scope: !36)
!105 = !DILocation(line: 52, column: 17, scope: !36)
!106 = !DILocation(line: 53, column: 6, scope: !36)
!107 = !DILocation(line: 53, scope: !36)
!108 = !DILocalVariable(name: "x", scope: !36, file: !3, line: 58, type: !7)
!109 = !DILocation(line: 58, column: 4, scope: !36)
!110 = !DILocation(line: 58, column: 20, scope: !36)
!111 = !DILocation(line: 59, column: 10, scope: !36)
!112 = !DILocation(line: 59, column: 4, scope: !36)
!113 = !DILocation(line: 62, column: 6, scope: !36)
!114 = !DILocation(line: 62, scope: !36)
!115 = !DILocation(line: 66, column: 4, scope: !36)
!116 = !DILocation(line: 66, column: 14, scope: !36)
!117 = !DILocation(line: 67, column: 4, scope: !36)
!118 = !DILocation(line: 68, column: 8, scope: !36)
!119 = !DILocation(line: 68, column: 14, scope: !36)
!120 = !DILocation(line: 68, column: 21, scope: !36)
!121 = !DILocation(line: 68, column: 27, scope: !36)
!122 = !DILocation(line: 69, column: 14, scope: !36)
!123 = !DILocation(line: 69, column: 20, scope: !36)
!124 = !DILocation(line: 72, column: 4, scope: !36)
!125 = !DILocalVariable(name: "a", scope: !36, file: !3, line: 76, type: !7)
!126 = !DILocation(line: 76, scope: !36)
!127 = !DILocation(line: 76, column: 16, scope: !36)
!128 = !DILocation(line: 77, column: 7, scope: !36)
!129 = !DILocation(line: 77, column: 11, scope: !36)
!130 = !DILocation(line: 78, column: 10, scope: !36)
!131 = !DILocation(line: 78, column: 4, scope: !36)
!132 = !DILocation(line: 79, column: 8, scope: !36)
!133 = !DILocation(line: 79, column: 12, scope: !36)
!134 = !DILocalVariable(name: "i", scope: !36, file: !3, line: 83, type: !7)
!135 = !DILocation(line: 83, column: 5, scope: !36)
!136 = !DILocation(line: 83, column: 21, scope: !36)
!137 = !DILocation(line: 83, column: 24, scope: !36)
!138 = !DILocation(line: 83, column: 28, scope: !36)
!139 = !DILocation(line: 84, column: 10, scope: !36)
!140 = !DILocation(line: 84, column: 4, scope: !36)
!141 = !DILocation(line: 83, column: 36, scope: !36)
!142 = !DILocation(line: 83, column: 40, scope: !36)
!143 = !DILocation(line: 100, column: 12, scope: !36)
!144 = !DILocation(line: 102, column: 22, scope: !36)
!145 = !DILocation(line: 102, scope: !36)
!146 = !DILocation(line: 102, column: 1, scope: !36)
