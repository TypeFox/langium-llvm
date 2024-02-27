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
var add = 23 + 41;
var subtract = 13 - 4;
var multiply = 13 * 4;
var divide = 62 / 2;

var negateMe = -add;

// Comparison and equality
var less = add < subtract;
var more = multiply > divide;

var equality = add == subtract;
var inequality = multiply != divide;

// Unary logical operator
var isTrue = !false;
var isFalse = !true;

// Binary logical operator
var andTrue = isTrue and !isFalse;
var orFalse = !isTrue or isFalse;

// Precedence and grouping
var min = 14;
var max = 22;
var average = (min + max) / 2;

// Variables
// Can reassign an existing variable
min = 5;

// Printing
print average;

// Blocks
{
    print "This is a new block";
    var x = 15;
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
var a = 1;
while (a < 10) {
    print a;
    a = a + 1;
}

// For loops
for (var i = 1; i < 10; i = i + 1) {
    print i;
}

// Functions
fun printSum(a: number, b: number): void {
    print a + b;
}

fun returnSum(a: number, b: number): number {
    return a + b;
}
