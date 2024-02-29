grammar Ox

entry OxProgram:
    elements+=OxElement*;

OxElement:
    ExpressionBlock | 
    IfStatement |
    WhileStatement |
    ForStatement |
    FunctionDeclaration |
    VariableDeclaration ';' | 
    PrintStatement ';' | 
    ReturnStatement ';' | 
    Expression ';'
;

IfStatement: 
    'if' '(' condition=Expression ')' block=ExpressionBlock
    ('else' elseBlock=ExpressionBlock)?
;

WhileStatement:
    'while' '(' condition=Expression ')' block=ExpressionBlock
;

ForStatement:
    'for' '(' counter=VariableDeclaration? ';' condition=Expression? ';' execution=Expression? ')' block=ExpressionBlock
;

PrintStatement: 'print' value=Expression;

ReturnStatement: 'return' value=Expression?;

ExpressionBlock: '{'
    elements+=OxElement*
'}';

VariableDeclaration returns NamedElement:
    {infer VariableDeclaration} 'var' name=ID (':' type=TypeReference) (assignment?='=' value=Expression)?
;

Expression:
    Assignment;

Assignment infers Expression:
    Addition ({infer BinaryExpression.left=current} operator=('=') right=Addition)*;

Addition infers Expression:
    Multiplication ({infer BinaryExpression.left=current} operator=('+' | '-') right=Multiplication)*;

Multiplication infers Expression:
    Logical ({infer BinaryExpression.left=current} operator=('*' | '/') right=Logical)*;

Logical infers Expression:
    Comparison ({infer BinaryExpression.left=current} operator=('and' | 'or') right=Comparison)*;

Comparison infers Expression:
    Primary ({infer BinaryExpression.left=current} operator=('<' | '<=' | '>' | '>=' | '==' | '!=') right=Primary)*;

Primary infers Expression:
    '(' Expression ')' |
    UnaryExpression |
    BooleanExpression |
    NumberExpression |
    MemberCall;

MemberCall:
    element=[NamedElement:ID] (
		explicitOperationCall?='('
		(
		    arguments+=Expression (',' arguments+=Expression)*
		)?
		')')?;

UnaryExpression:
   operator=('!' | '-') value=Expression
;

NumberExpression: value=NUMBER;
BooleanExpression: value?='true' | 'false';

FunctionDeclaration:
    'fun' name=ID '(' (parameters+=Parameter (',' parameters+=Parameter)*)? ')' ':' returnType=TypeReference body=ExpressionBlock;

Parameter: name=ID ':' type=TypeReference;

TypeReference: primitive=("number" | "boolean" | "void");

type NamedElement = Parameter | FunctionDeclaration | VariableDeclaration;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal NUMBER returns number: /[0-9]+(\.[0-9]+)?/;
// terminal STRING: /"[^"]*"/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;