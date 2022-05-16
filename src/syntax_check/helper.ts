/*
    helper.ts
    May 2022

    This file contains helper functions that identify Python syntax errors

    1. Missing colon
    2. Misplaced colon
    3. Missing indentation
    4. Misaligned indentations
    5. Missing parenthesis
    6. Incorrect import

    See details at
    https://github.com/macarl08/free-text
*/

// importing a list (string) of python standard libraries
import { python_stdilb } from "./python_stdlib";

// defining a list (array) of python "compound statement" keywords
// lines that start with any of these keywords will have
//     - a colon at the end
//     - a newline followed by an indentation 
var compound_statements = ["if", "while", "for", "try", "with", "match", "def", "class"];

// helper to sanitize a line of Python code
function cleanLine(line: string): string {
    line = line.split("#")[0]; // remove in-line comments, if any
    line = line.trimEnd(); // remove trailing whitespace
    return line;
}

// helper to determine if a line contains a "compound statement" keyword
function hasKeyword(line: string): boolean {
    var keyword = line.trimStart().split(/\s+/)[0];
    return compound_statements.includes(keyword);
}

// corresponds to Python Syntax Error (1)
export function checkMissingColon(line: string): number {
    /*
    Goal: check if a "compound statement" line is missing a colon

    Input: a line of Python code
    Output: -1 if not missing, or
            index of expected colon
    */

    line = cleanLine(line);
    if (hasKeyword(line)) {
        if (line.endsWith(":")) return -1;
        else return line.length
    }
    return -1;
}

// corresponds to Python Syntax Error (2)
export function find_misplaced_colon(line: string) {
    /*
    Goal: check if a line has misplaced colons

    Input: a line of Python code
    Output: -1 if no misplaced colons, or
            index of first unexpected colon

    Note: valid colons locations are:
        - within double quotes
        - within single quotes
        - within square brackets (string/list slicing)
        - within curly brackets (dictionary)
    */

    line = cleanLine(line);

    // replace all : in "" with placeholder @
    line = line.replace(/"[^"]+"/g, match => match.replace(/:/g, '@'));
    // replace all : in '' with placeholder @
    line = line.replace(/'[^']+'/g, match => match.replace(/:/g, '@'));
    // replace all : in [] with placeholder @
    line = line.replace(/\[[^\]]+\]/g, match => match.replace(/:/g, '@'));
    // replace all : in {} with placeholder @
    line = line.replace(/\{[^\}]+\}/g, match => match.replace(/:/g, '@'));

    // return first occurance of any left-behind colons
    // index is automatically -1 if not found
    var index = line.search(":");

    // check if this left-behind colon is at the EOL of a compound statement,
    // which is permitted
    if (hasKeyword(line) && index == line.length - 1) return -1;
    else return index;
}

// corresponds to Python Syntax Error (3-4)
export function checkIndentation(entire_code: string) {
    /*
    Goal: check if a line has missing and/or misaligned indentation

    Input: the entire Python code (lines separated by \n)
    Output: -1 if no missing and/or misaligned indentation, or
            line number of first incorrect indentation
    */

    var current_indentation = 0, next_indentation = 0, diff = 0;
    var must_indent = false;

    // make an array of Python lines 
    var entire_code_arr = entire_code.split('\n');

    // no need to check indentation if the program is 1 line long
    if (entire_code_arr.length < 2) return -1;

    // loop thru array
    for (var i = 0; i < entire_code_arr.length; i++) {

        // current_indentation is the number of preceding whitespace in a line
        // this number is equivalent to the index of the first non-whitespace char
        current_indentation = entire_code_arr[i].search(/\S|$/);

        diff = next_indentation - current_indentation;

        // current_indentation must not be greater than next_indentation
        if (diff < 0) return i + 1; // note: line number = index + 1

        // current_indentation may be less than next_indentation
        // IF it is not immediately after a compound statement
        if (diff > 0 && must_indent) return i + 1;

        must_indent = false;

        // increment next_indentation at a compound statement
        if (hasKeyword(entire_code_arr[i])) {
            next_indentation = current_indentation + 1;
            must_indent = true;
        }
    }
    return -1
}

// corresponds to Python Syntax Error (5)
export function checkParenthesis(line: string) {
    /*
    Goal: check if a left parenthesis is matched with a right parenthesis 

    Input: a line of Python code
    Output: -1 if no unpaired parenthesis, or
            index of first unexpected parenthesis
    */

    line = cleanLine(line);

    var counter = 0;
    for (var i = 0; i < line.length; i++) {
        if (line.charAt(i) == '(') counter++;
        if (line.charAt(i) == ')') counter--;
        if (counter < 0) return i;
    }

    if (counter > 0) return line.length;
    return -1
}

// corresponds to Python Syntax Error (6)
export function checkImportStatement(line: string) {
    /*
    Goal: check if an import statement is correctly written

    Input: a line of Python code
    Output: -1 if nothing wrong, or
            index of incorrect import syntax
    
    Note:
    there are three ways to import:
        1. import math
        2. import math as ma
        3. from math import pi
    */

    line = cleanLine(line);

    // only check statements with the keyword import
    if (line.includes("import")) {

        // make an array of words in the line
        var line_arr = line.split(/\s+/);

        if (line_arr.length == 2 || line_arr.length == 4) {

            // cannot find
            if (python_stdilb.indexOf(line_arr[1]) === -1) return line.indexOf(line_arr[1]);

            if (line_arr.length == 2) return -1;

            if (line_arr.length == 4 && (line_arr[0] == "from" || line_arr[2] == "as")) return -1

        }
        return line.indexOf("import") // there is something wrong with this import statement
    }
    return -1
}
//done!