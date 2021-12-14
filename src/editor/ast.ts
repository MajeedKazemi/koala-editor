import { AugmentedAssignmentOperator, BinaryOperator, DataType, UnaryOperator } from "./consts";
import { Module } from "./module";

export interface CodeConstruct {}

export abstract class Statement implements CodeConstruct {}

export abstract class Expression extends Statement implements CodeConstruct {
    returns: DataType;

    constructor(returns: DataType) {
        super();

        this.returns = returns;
    }
}

export abstract class Modifier extends Expression {
    constructor() {
        super(null);
    }
}

export abstract class Token implements CodeConstruct {}

export class Argument {
    type: DataType[];
    name: string;
    isOptional: boolean;

    constructor(type: DataType[], name: string, isOptional: boolean) {
        this.type = type;
        this.name = name;
        this.isOptional = isOptional;
    }
}

export class WhileStatement extends Statement {
    constructor(root?: CodeConstruct | Module, indexInRoot?: number) {
        super();
    }
}

export class IfStatement extends Statement {
    constructor(root?: CodeConstruct | Module, indexInRoot?: number) {
        super();
    }
}

export class ElseStatement extends Statement {
    constructor(hasCondition: boolean, root?: IfStatement, indexInRoot?: number) {
        super();
    }
}

export class ImportStatement extends Statement {
    constructor(moduleName: string = "", itemName: string = "") {
        super();
    }
}

export class ForStatement extends Statement {
    constructor(root?: CodeConstruct | Module, indexInRoot?: number) {
        super();
    }
}

export class EmptyLineStmt extends Statement {
    constructor(root?: Statement | Module, indexInRoot?: number) {
        super();
    }
}

export class VarAssignmentStmt extends Statement {
    constructor(buttonId?: string, id?: string, root?: Statement | Module, indexInRoot?: number) {
        super();
    }
}

export class VariableReferenceExpr extends Expression {
    constructor(id: string, returns: DataType, uniqueId: string, root?: Statement, indexInRoot?: number) {
        super(returns);
    }
}

export class ValueOperationExpr extends Expression {
    constructor(value: Expression, modifiers?: Array<Modifier>, root?: Statement, indexInRoot?: number) {
        super(value != null ? value.returns : DataType.Void);
    }
}

export class VarOperationStmt extends Statement {
    constructor(ref: VariableReferenceExpr, modifiers?: Array<Modifier>, root?: Statement, indexInRoot?: number) {
        super();
    }
}

export class ListAccessModifier extends Modifier {
    constructor(root?: ValueOperationExpr | VarOperationStmt, indexInRoot?: number) {
        super();
    }
}

export class PropertyAccessorModifier extends Modifier {
    constructor(
        propertyName: string,
        exprType: DataType,
        root?: ValueOperationExpr | VarOperationStmt,
        indexInRoot?: number
    ) {
        super();
    }
}

export class MethodCallModifier extends Modifier {
    constructor(
        functionName: string,
        args: Array<Argument>,
        returns: DataType,
        exprType: DataType,
        root?: ValueOperationExpr | VarOperationStmt,
        indexInRoot?: number
    ) {
        super();
    }
}

export class AssignmentModifier extends Modifier {
    constructor(root?: VarOperationStmt, indexInRoot?: number) {
        super();
    }
}

export class AugmentedAssignmentModifier extends Modifier {
    constructor(operation: AugmentedAssignmentOperator, root?: VarOperationStmt, indexInRoot?: number) {
        super();
    }
}

export class FunctionCallExpr extends Expression {
    constructor(
        functionName: string,
        args: Array<Argument>,
        returns: DataType,
        root?: Statement,
        indexInRoot?: number,
        requiredModule: string = ""
    ) {
        super(returns);
    }
}

export class FunctionCallStmt extends Statement {
    constructor(
        functionName: string,
        args: Array<Argument>,
        root?: Statement | Module,
        indexInRoot?: number,
        requiredModule: string = ""
    ) {
        super();
    }
}

export class ListElementAssignment extends Statement {
    constructor(root?: Expression, indexInRoot?: number) {
        super();
    }
}

export class KeywordStmt extends Statement {
    constructor(keyword, root?: Statement | Expression, indexInRoot?: number) {
        super();
    }
}

export class MemberCallStmt extends Expression {
    operator: BinaryOperator;

    constructor(returns: DataType, root?: Statement | Expression, indexInRoot?: number) {
        super(returns);
    }
}

export class BinaryOperatorExpr extends Expression {
    constructor(operator: BinaryOperator, returns: DataType, root?: Statement | Expression, indexInRoot?: number) {
        super(returns);
    }
}

export class UnaryOperatorExpr extends Expression {
    constructor(
        operator: UnaryOperator,
        returns: DataType,
        operatesOn: DataType = DataType.Any,
        root?: Statement | Expression,
        indexInRoot?: number
    ) {
        super(returns);
    }
}

export class EditableTextTkn extends Token {
    isTextEditable = true;
    validatorRegex: RegExp;

    constructor(text: string, regex: RegExp, root?: CodeConstruct, indexInRoot?: number) {
        super();
    }
}

export class EmptyOperatorTkn extends Token {
    constructor(text: string, root?: CodeConstruct, indexInRoot?: number) {
        super();
    }
}

export class OperatorTkn extends Modifier {
    constructor(operator: UnaryOperator | BinaryOperator, root?: Statement | Expression, indexInRoot?: number) {
        super();
    }
}

export class LiteralValExpr extends Expression {
    valueTokenIndex: number = 0;

    constructor(returns: DataType, value?: string, root?: Statement | Expression, indexInRoot?: number) {
        super(returns);
    }
}

export class FormattedStringExpr extends Expression {
    constructor(value?: string, root?: Statement | Expression, indexInRoot?: number) {
        super(DataType.String);
    }
}

export class FormattedStringCurlyBracketsExpr extends Expression {
    constructor(root?: Statement | Expression, indexInRoot?: number) {
        super(DataType.String);
    }
}

export class ListLiteralExpression extends Expression {
    constructor(root?: Statement | Expression, indexInRoot?: number) {
        super(DataType.AnyList);
    }
}

export class ListComma extends Expression {
    constructor() {
        super(DataType.Void);
    }
}
