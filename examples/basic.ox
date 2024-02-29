// Data types
// Booleans
true;  // Not false.
false; // Not *not* false.

// Numbers
1234;  // An integer.
12.34; // A decimal number.

// Strings
"I am a string";
"";    // The empty string.
"123"; // This is a string, not a number.

// Expressions
// Arithmetics
var add: number = 23 + 41;
var subtract: number = 13 - 4;
var multiply: number = 13 * 4;
var divide: number = 62 / 2;

var negateMe: number = -add;

// Comparison and equality
var less: boolean = add < subtract;
var more: boolean = multiply > divide;

var equality: boolean = add == subtract;
var inequality: boolean = multiply != divide;

// Unary logical operator
var isTrue: boolean = !false;
var isFalse: boolean = !true;

// Binary logical operator
var andTrue: boolean = isTrue and !isFalse;
var orFalse: boolean = !isTrue or isFalse;

// Precedence and grouping
var min: number = 14;
var max: number = 22;
var average: number = (min + max) / 2;

// Variables
// Can reassign an existing variable
min = 5;

// Printing
print average;

// Blocks
{
    print "This is a new block";
    var x: number = 15;
}
print "`x` isn't available in this scope";

// Control flow
// If branching
if (average > 5) {
    print "yes";
} else {
    print "no";
}

// While loops
var a: number = 1;
while (a < 10) {
    print a;
    a = a + 1;
}

// For loops
for (var i: number = 1; i < 10; i = i + 1) {
    print i;
}

// Functions
fun printSum(a: number, b: number): void {
    print a + b;
}

fun returnSum(a: number, b: number): number {
    return a + b;
}
