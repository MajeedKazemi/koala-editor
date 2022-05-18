# Syntax Check Module

## About
A syntax check module that currently identifies the following Python syntax errors:
1. Missing colon
1. Misplaced colon
1. Missing indentation
1. Misaligned indentations
1. Missing parenthesis
1. Incorrect import

## History
This [Commit](https://github.com/MajeedKazemi/intropy-editor/tree/syntax-check) is the latest on branch `syntax-check`.

Past commits:

[Major Commit 2](https://github.com/MajeedKazemi/intropy-editor/commit/59f7a34a76b04bea2c3a9064c03c265d567b4ad1): bug fix
* added visual indicators for syntax issues
* fixed #2

[Major Commit 1](https://github.com/MajeedKazemi/intropy-editor/commit/ba2a87ae027bbdba7920f155af302a6773441aa4): upload existing files
* added existing syntax checker code
* added TDD testing code
* fixed #1

## Future
* bug fix (when dealing with new lines)
* additional syntax checkers

## How to Run?
1. Navigate to the `pybox-editor/` directory
1. Install all required modules by running `npm install`
1. Run `npm run build` to compile the webpack
1. Open `pybox-editor/dist/index.html` with a browser

## Test Cases
A list of test cases is offered below.
### No Error
```
# Import
import sys
from math import sqrt
import datetime as dt

# Missing/Misplaced Colons
if True:
for item in a[1:10]:
for each in {"A":"10", "B":"11"}:
while a==True: # random co:l:ons

# Parenthesis
a = (((True)))
if (a==False) # random )parenthesis
```

### Error
```
# Import
import mak
from mak import sqrt
import sqrt from mak

# Missing/Misplaced Colons
for i in range(10)
if True)

# Parenthesis
b = )haha(
```