import * as AddVarDocs from "../docs/add-var.json";
import * as AddDocs from "../docs/add.json";
import * as AndDocs from "../docs/and.json";
import * as AssignAddDocs from "../docs/assign-add.json";
import * as AssignDivDocs from "../docs/assign-div.json";
import * as AssignMultDocs from "../docs/assign-mult.json";
import * as AssignSubDocs from "../docs/assign-sub.json";
import * as AssignDocs from "../docs/assign.json";
import * as BreakDocs from "../docs/break.json";
import * as RandChoiceDocs from "../docs/choice.json";
import * as CompEqDocs from "../docs/comp-eq.json";
import * as CompGtDocs from "../docs/comp-gt.json";
import * as CompGteDocs from "../docs/comp-gte.json";
import * as CompLtDocs from "../docs/comp-lt.json";
import * as CompLteDocs from "../docs/comp-lte.json";
import * as CompNeDocs from "../docs/comp-ne.json";
import * as DivDocs from "../docs/div.json";
import * as ElifDocs from "../docs/elif.json";
import * as ElseDocs from "../docs/else.json";
import * as FStringItemDocs from "../docs/f-str-item.json";
import * as FStringDocs from "../docs/f-str.json";
import * as FalseDocs from "../docs/false.json";
import * as FindDocs from "../docs/find.json";
import * as FloorDivDocs from "../docs/floor-div.json";
import * as ForDocs from "../docs/for.json";
import * as IfDocs from "../docs/if.json";
import * as ImportDocs from "../docs/import.json";
import * as InDocs from "../docs/in.json";
import * as InputDocs from "../docs/input.json";
import * as JoinDocs from "../docs/join.json";
import * as LenDocs from "../docs/len.json";
import * as ListAppendDocs from "../docs/list-append.json";
import * as ListIndexDocs from "../docs/list-index.json";
import * as ListItemDocs from "../docs/list-item.json";
import * as ListLiteralDocs from "../docs/list-literal.json";
import * as ModDocs from "../docs/mod.json";
import * as MultDocs from "../docs/mult.json";
import * as NotInDocs from "../docs/not-in.json";
import * as NotDocs from "../docs/not.json";
import * as NumDocs from "../docs/num.json";
import * as OrDocs from "../docs/or.json";
import * as PrintDocs from "../docs/print.json";
import * as RandintDocs from "../docs/randint.json";
import * as RangeDocs from "../docs/range.json";
import * as ReplaceDocs from "../docs/replace.json";
import * as SplitDocs from "../docs/split.json";
import * as StrDocs from "../docs/str.json";
import * as SubDocs from "../docs/sub.json";
import * as CastToIntDocs from "../docs/to-int.json";
import * as CastToStrDocs from "../docs/to-str.json";
import * as TrueDocs from "../docs/true.json";
import * as WhileDocs from "../docs/while.json";
import {
    Argument,
    AssignmentModifier,
    AugmentedAssignmentModifier,
    BinaryOperatorExpr,
    ElseStatement,
    Expression,
    FormattedStringCurlyBracketsExpr,
    FormattedStringExpr,
    ForStatement,
    FunctionCallExpr,
    FunctionCallStmt,
    IfStatement,
    ImportStatement,
    KeywordStmt,
    ListAccessModifier,
    ListComma,
    ListLiteralExpression,
    LiteralValExpr,
    MethodCallModifier,
    Modifier,
    OperatorTkn,
    Statement,
    UnaryOperatorExpr,
    VarAssignmentStmt,
    WhileStatement,
} from "./ast";

export enum DataType {
    Number = "Number",
    Boolean = "Boolean",
    String = "String",
    FormattedString = "FormattedString",
    Fractional = "Float",
    Iterator = "Iterator",
    AnyList = "ListAny",
    Set = "Set",
    Dict = "Dict",
    Class = "Class",
    Void = "Void",
    Any = "Any",
    NumberList = "ListInt",
    BooleanList = "ListBool",
    StringList = "ListStr",
}

export enum BinaryOperator {
    Add = "+",
    Subtract = "-",
    Multiply = "*",
    Divide = "/",
    Mod = "%",
    Pow = "**",
    LeftShift = "<<",
    RightShift = ">>",
    BitOr = "|",
    BitXor = "^",
    BitAnd = "&",
    FloorDiv = "//",

    And = "and",
    Or = "or",

    Equal = "==",
    NotEqual = "!=",
    LessThan = "<",
    LessThanEqual = "<=",
    GreaterThan = ">",
    GreaterThanEqual = ">=",
    Is = "is",
    IsNot = "is not",
    In = "in",
    NotIn = "not in",
}

export enum UnaryOperator {
    Invert = "~",
    Not = "not",
    UAdd = "+",
    USub = "-",
}

export enum AugmentedAssignmentOperator {
    Add = "+=",
    Subtract = "-=",
    Multiply = "*=",
    Divide = "/=",
    Mod = "%=",
    Pow = "**=",
    LeftShift = "<<=",
    RightShift = ">>=",
    BitOr = "|=",
    BitXor = "^=",
    BitAnd = "&=",
    FloorDiv = "//=",
}

export function getUserFriendlyType(type: DataType): string {
    switch (type) {
        case DataType.Any:
            return "any";
        case DataType.AnyList:
            return "list of any";
        case DataType.Boolean:
            return "boolean";
        case DataType.BooleanList:
            return "list of booleans";
        case DataType.Number:
            return "number";
        case DataType.NumberList:
            return "list of numbers";
        case DataType.String:
            return "text";
        case DataType.StringList:
            return "list of texts";
        case DataType.Iterator:
            return "iterator";
        default:
            return type;
    }
}

export class EditCodeAction {
    name: string;
    id: string;
    getCodeFunction: () => Statement | Expression;
    documentation: any;

    constructor(name: string, id: string, getCodeFunction: () => Statement | Expression, doc: any) {
        this.name = name;
        this.id = id;
        this.getCodeFunction = getCodeFunction;
        this.documentation = doc;
    }

    getUserFriendlyReturnType(): string {
        const code = this.getCode();

        if (code instanceof Expression && !(code instanceof Modifier) && !(code instanceof ListComma))
            return getUserFriendlyType(code.returns);
        else return "";
    }

    getCode() {
        return this.getCodeFunction();
    }
}

export class ToolboxCategory {
    displayName: string;
    id: string;
    items: Array<EditCodeAction> = [];

    constructor(displayName: string, id: string, items: Array<EditCodeAction>) {
        this.displayName = displayName;
        this.id = id;
        this.items = items;
    }
}

export class Actions {
    private static inst: Actions;
    toolboxCategories: Array<ToolboxCategory> = [];

    private constructor() {
        const PrintStmt = new EditCodeAction(
            "print(---)",
            "add-print-btn",
            () => new FunctionCallStmt("print", [new Argument([DataType.Any], "item", false)]),
            PrintDocs
        );

        const RandIntExpr = new EditCodeAction(
            "randint(---, ---)",
            "add-randint-btn",
            () =>
                new FunctionCallExpr(
                    "randint",
                    [new Argument([DataType.Number], "start", false), new Argument([DataType.Number], "end", false)],
                    DataType.Number,
                    null,
                    null,
                    "random"
                ),
            RandintDocs
        );

        const RandChoiceExpr = new EditCodeAction(
            "choice(---)",
            "add-choice-btn",
            () =>
                new FunctionCallExpr(
                    "choice",
                    [new Argument([DataType.AnyList], "choices", false)],
                    DataType.Any,
                    null,
                    null,
                    "random"
                ),
            RandChoiceDocs
        );

        const RangeExpr = new EditCodeAction(
            "range(---)",
            "add-range-btn",
            () => new FunctionCallExpr("range", [new Argument([DataType.Number], "end", false)], DataType.NumberList),
            RangeDocs
        );

        const LenExpr = new EditCodeAction(
            "len(---)",
            "add-len-btn",
            () =>
                new FunctionCallExpr(
                    "len",
                    [
                        new Argument(
                            [
                                DataType.AnyList,
                                DataType.StringList,
                                DataType.BooleanList,
                                DataType.NumberList,
                                DataType.String,
                            ],
                            "list",
                            false
                        ),
                    ],
                    DataType.Number
                ),
            LenDocs
        );

        const InputExpr = new EditCodeAction(
            "input(---)",
            "add-input-btn",
            () => new FunctionCallExpr("input", [new Argument([DataType.String], "prompt", true)], DataType.String),
            InputDocs
        );

        const StringLiteralExpr = new EditCodeAction(
            '""',
            "add-str-btn",
            () => new LiteralValExpr(DataType.String, ""),
            StrDocs
        );

        const FormattedStringLiteralExpr = new EditCodeAction(
            "f''",
            "add-f-str-literal-btn",
            () => new FormattedStringExpr(""),
            FStringDocs
        );

        const FormattedStringItem = new EditCodeAction(
            "{}",
            "add-f-str-item-btn",
            () => new FormattedStringCurlyBracketsExpr(),
            FStringItemDocs
        );

        const NumberLiteralExpr = new EditCodeAction(
            "0",
            "add-num-btn",
            () => new LiteralValExpr(DataType.Number, "0"),
            NumDocs
        );

        const BooleanTrueLiteralExpr = new EditCodeAction(
            "True",
            "add-true-btn",
            () => new LiteralValExpr(DataType.Boolean, "True"),
            TrueDocs
        );

        const BooleanFalseLiteralExpr = new EditCodeAction(
            "False",
            "add-false-btn",
            () => new LiteralValExpr(DataType.Boolean, "False"),
            FalseDocs
        );

        const BinAddExpr = new EditCodeAction(
            "--- + ---",
            "add-bin-add-expr-btn",
            () => new BinaryOperatorExpr(BinaryOperator.Add, DataType.Number),
            AddDocs
        );

        const BinSubExpr = new EditCodeAction(
            "--- - ---",
            "add-bin-sub-expr-btn",
            () => new BinaryOperatorExpr(BinaryOperator.Subtract, DataType.Number),
            SubDocs
        );

        const BinMultExpr = new EditCodeAction(
            "--- * ---",
            "add-bin-mul-expr-btn",
            () => new BinaryOperatorExpr(BinaryOperator.Multiply, DataType.Number),
            MultDocs
        );

        const BinDivExpr = new EditCodeAction(
            "--- / ---",
            "add-bin-div-expr-btn",
            () => new BinaryOperatorExpr(BinaryOperator.Divide, DataType.Number),
            DivDocs
        );

        const BinFloorDivExpr = new EditCodeAction(
            "--- // ---",
            "add-bin-floor-div-expr-btn",
            () => new BinaryOperatorExpr(BinaryOperator.FloorDiv, DataType.Number),
            FloorDivDocs
        );

        const BinModExpr = new EditCodeAction(
            "--- % ---",
            "add-bin-mod-expr-btn",
            () => new BinaryOperatorExpr(BinaryOperator.Mod, DataType.Number),
            ModDocs
        );

        const InOperatorTkn = new EditCodeAction(
            "in",
            "add-in-op-tkn-btn",
            () => new OperatorTkn(BinaryOperator.In),
            InDocs
        );

        const NotInOperatorTkn = new EditCodeAction(
            "not in",
            "add-not-in-op-tkn-btn",
            () => new OperatorTkn(BinaryOperator.NotIn),
            NotInDocs
        );

        const AddOperatorTkn = new EditCodeAction(
            "+",
            "add-add-op-tkn-btn",
            () => new OperatorTkn(BinaryOperator.Add),
            AddDocs
        );

        const SubOperatorTkn = new EditCodeAction(
            "-",
            "add-sub-op-tkn-btn",
            () => new OperatorTkn(BinaryOperator.Subtract),
            SubDocs
        );

        const MultOperatorTkn = new EditCodeAction(
            "*",
            "add-mult-op-tkn-btn",
            () => new OperatorTkn(BinaryOperator.Multiply),
            MultDocs
        );

        const DivOperatorTkn = new EditCodeAction(
            "/",
            "add-div-op-tkn-btn",
            () => new OperatorTkn(BinaryOperator.Divide),
            DivDocs
        );

        const FloorDivOperatorTkn = new EditCodeAction(
            "//",
            "add-floor-div-op-tkn-btn",
            () => new OperatorTkn(BinaryOperator.FloorDiv),
            DivDocs
        );

        const ModOperatorTkn = new EditCodeAction(
            "%",
            "add-mod-op-tkn-btn",
            () => new OperatorTkn(BinaryOperator.Mod),
            DivDocs
        );

        const BinAndExpr = new EditCodeAction(
            "--- and ---",
            "add-bin-and-expr-btn",
            () => new BinaryOperatorExpr(BinaryOperator.And, DataType.Boolean),
            AndDocs
        );

        const BinOrExpr = new EditCodeAction(
            "--- or ---",
            "add-bin-or-expr-btn",
            () => new BinaryOperatorExpr(BinaryOperator.Or, DataType.Boolean),
            OrDocs
        );

        const AndOperatorTkn = new EditCodeAction(
            "and",
            "add-and-op-tkn-btn",
            () => new OperatorTkn(BinaryOperator.And),
            AndDocs
        );

        const OrOperatorTkn = new EditCodeAction(
            "or",
            "add-or-op-tkn-btn",
            () => new OperatorTkn(BinaryOperator.Or),
            OrDocs
        );

        const BinCompEqExpr = new EditCodeAction(
            "--- == ---",
            "add-comp-eq-expr-btn",
            () => new BinaryOperatorExpr(BinaryOperator.Equal, DataType.Boolean),
            CompEqDocs
        );

        const BinCompNeqExpr = new EditCodeAction(
            "--- != ---",
            "add-comp-neq-expr-btn",
            () => new BinaryOperatorExpr(BinaryOperator.NotEqual, DataType.Boolean),
            CompNeDocs
        );

        const BinCompLtExpr = new EditCodeAction(
            "--- < ---",
            "add-comp-lt-expr-btn",
            () => new BinaryOperatorExpr(BinaryOperator.LessThan, DataType.Boolean),
            CompLtDocs
        );

        const BinCompLteExpr = new EditCodeAction(
            "--- <= ---",
            "add-comp-lte-expr-btn",
            () => new BinaryOperatorExpr(BinaryOperator.LessThanEqual, DataType.Boolean),
            CompLteDocs
        );

        const BinCompGtExpr = new EditCodeAction(
            "--- > ---",
            "add-comp-gt-expr-btn",
            () => new BinaryOperatorExpr(BinaryOperator.GreaterThan, DataType.Boolean),
            CompGtDocs
        );

        const BinCompGteExpr = new EditCodeAction(
            "--- >= ---",
            "add-comp-gte-expr-btn",
            () => new BinaryOperatorExpr(BinaryOperator.GreaterThanEqual, DataType.Boolean),
            CompGteDocs
        );

        const EqOperatorTkn = new EditCodeAction(
            "==",
            "add-comp-eq-op-tkn-btn",
            () => new OperatorTkn(BinaryOperator.Equal),
            CompEqDocs
        );

        const NeqOperatorTkn = new EditCodeAction(
            "!=",
            "add-comp-neq-op-tkn-btn",
            () => new OperatorTkn(BinaryOperator.NotEqual),
            CompNeDocs
        );

        const GtOperatorTkn = new EditCodeAction(
            ">",
            "add-comp-gt-op-tkn-btn",
            () => new OperatorTkn(BinaryOperator.GreaterThan),
            CompNeDocs
        );

        const LtOperatorTkn = new EditCodeAction(
            "<",
            "add-comp-lt-op-tkn-btn",
            () => new OperatorTkn(BinaryOperator.LessThan),
            CompNeDocs
        );

        const GteOperatorTkn = new EditCodeAction(
            ">=",
            "add-comp-gte-op-tkn-btn",
            () => new OperatorTkn(BinaryOperator.GreaterThanEqual),
            CompNeDocs
        );

        const LteOperatorTkn = new EditCodeAction(
            "<=",
            "add-comp-lte-op-tkn-btn",
            () => new OperatorTkn(BinaryOperator.LessThanEqual),
            CompNeDocs
        );

        const BinInExpr = new EditCodeAction(
            "--- in ---",
            "add-bin-in-expr-btn",
            () => new BinaryOperatorExpr(BinaryOperator.In, DataType.Boolean),
            InDocs
        );

        const BinNotInExpr = new EditCodeAction(
            "--- not in ---",
            "add-bin-not-in-expr-btn",
            () => new BinaryOperatorExpr(BinaryOperator.NotIn, DataType.Boolean),
            NotInDocs
        );

        const UnaryNotExpr = new EditCodeAction(
            "not ---",
            "add-unary-not-expr-btn",
            () => new UnaryOperatorExpr(UnaryOperator.Not, DataType.Boolean),
            NotDocs
        );

        const FindMethodMod = new EditCodeAction(
            ".find(---)",
            "add-find-method-call-btn",
            () =>
                new MethodCallModifier(
                    "find",
                    [new Argument([DataType.String], "item", false)],
                    DataType.Number,
                    DataType.String
                ),
            FindDocs
        );

        const WhileStmt = new EditCodeAction(
            "while (---) :",
            "add-while-expr-btn",
            () => new WhileStatement(),
            WhileDocs
        );

        const BreakStmt = new EditCodeAction(
            "break",
            "add-break-stmt-btn",
            () => new KeywordStmt("break", null, null),
            BreakDocs
        );

        const IfStmt = new EditCodeAction("if (---) :", "add-if-expr-btn", () => new IfStatement(), IfDocs);

        const ElifStmt = new EditCodeAction(
            "elif (---) :",
            "add-elif-expr-btn",
            () => new ElseStatement(true),
            ElifDocs
        );

        const ElseStmt = new EditCodeAction("else :", "add-else-expr-btn", () => new ElseStatement(false), ElseDocs);

        const ForStmt = new EditCodeAction("for -- in --- :", "add-for-expr-btn", () => new ForStatement(), ForDocs);

        const ImportStmt = new EditCodeAction(
            "from --- import ---",
            "add-import-btn",
            () => new ImportStatement(),
            ImportDocs
        );

        const ImportRandintStmt = new EditCodeAction(
            "from random import randint",
            "add-import-randint-btn",
            () => new ImportStatement("random", "randint"),
            ImportDocs
        );

        const ImportChoiceStmt = new EditCodeAction(
            "from random import choice",
            "add-import-choice-btn",
            () => new ImportStatement("random", "choice"),
            ImportDocs
        );

        const ListLiteralExpr = new EditCodeAction(
            "[]",
            "add-list-literal-btn",
            () => new ListLiteralExpression(),
            ListLiteralDocs
        );

        const ListCommaItem = new EditCodeAction(", ---", "add-list-item-btn", () => new ListComma(), ListItemDocs);

        const ListIndexAccessor = new EditCodeAction(
            "[---]",
            "add-list-index-btn",
            () => new ListAccessModifier(),
            ListIndexDocs
        );

        const AssignmentMod = new EditCodeAction(
            "= ---",
            "add-assign-mod-btn",
            () => new AssignmentModifier(),
            AssignDocs
        );

        const AugAddAssignmentMod = new EditCodeAction(
            "+= ---",
            "add-aug-assign-add-mod-btn",
            () => new AugmentedAssignmentModifier(AugmentedAssignmentOperator.Add),
            AssignAddDocs
        );

        const AugSubAssignmentMod = new EditCodeAction(
            "-= ---",
            "add-aug-assign-sub-mod-btn",
            () => new AugmentedAssignmentModifier(AugmentedAssignmentOperator.Subtract),
            AssignSubDocs
        );

        const AugMulAssignmentMod = new EditCodeAction(
            "*= ---",
            "add-aug-assign-mul-mod-btn",
            () => new AugmentedAssignmentModifier(AugmentedAssignmentOperator.Multiply),
            AssignMultDocs
        );

        const AugDivAssignmentMod = new EditCodeAction(
            "/= ---",
            "add-aug-assign-div-mod-btn",
            () => new AugmentedAssignmentModifier(AugmentedAssignmentOperator.Divide),
            AssignDivDocs
        );

        const AppendMethodMod = new EditCodeAction(
            ".append(---)",
            "add-list-append-stmt-btn",
            () =>
                new MethodCallModifier(
                    "append",
                    [new Argument([DataType.Any], "object", false)],
                    DataType.Void,
                    DataType.AnyList
                ),
            ListAppendDocs
        );

        const ReplaceMethodMod = new EditCodeAction(
            ".replace(---, ---)",
            "add-replace-method-call-btn",
            () =>
                new MethodCallModifier(
                    "replace",
                    [new Argument([DataType.String], "old", false), new Argument([DataType.String], "new", false)],
                    DataType.String,
                    DataType.String
                ),
            ReplaceDocs
        );

        const JoinMethodMod = new EditCodeAction(
            ".join(---)",
            "add-join-method-call-btn",
            () =>
                new MethodCallModifier(
                    "join",
                    [
                        new Argument(
                            [DataType.AnyList, DataType.StringList, DataType.NumberList, DataType.BooleanList],
                            "items",
                            false
                        ),
                    ],
                    DataType.String,

                    DataType.String
                ),
            JoinDocs
        );

        const SplitMethodMod = new EditCodeAction(
            ".split(---)",
            "add-split-method-call-btn",
            () =>
                new MethodCallModifier(
                    "split",
                    [new Argument([DataType.String], "sep", false)],
                    DataType.StringList,
                    DataType.String
                ),

            SplitDocs
        );

        const CastStrExpr = new EditCodeAction(
            "str(---)",
            "add-cast-str-btn",
            () => new FunctionCallExpr("str", [new Argument([DataType.Any], "value", false)], DataType.String),
            CastToStrDocs
        );

        const CastIntExpr = new EditCodeAction(
            "int(---)",
            "add-cast-int-btn",
            () => new FunctionCallExpr("int", [new Argument([DataType.String], "value", false)], DataType.Number),
            CastToIntDocs
        );

        const VarAssignStmt = new EditCodeAction("var = ---", "add-var-btn", () => new VarAssignmentStmt(), AddVarDocs);

        this.toolboxCategories.push(
            new ToolboxCategory("Loops", "loops-toolbox-group", [WhileStmt, ForStmt, RangeExpr, BreakStmt])
        );
        this.toolboxCategories.push(
            new ToolboxCategory("Conditionals", "conditionals-toolbox-group", [IfStmt, ElifStmt, ElseStmt])
        );
        this.toolboxCategories.push(
            new ToolboxCategory("Functions", "functions-toolbox-group", [PrintStmt, InputExpr, LenExpr])
        );
        this.toolboxCategories.push(
            new ToolboxCategory("Variables", "create-var-toolbox-group", [
                VarAssignStmt,
                AssignmentMod,
                AugAddAssignmentMod,
                AugSubAssignmentMod,
                AugMulAssignmentMod,
                AugDivAssignmentMod,
            ])
        );
        this.toolboxCategories.push(new ToolboxCategory("Numbers", "numbers-toolbox-group", [NumberLiteralExpr]));
        this.toolboxCategories.push(
            new ToolboxCategory("Random", "randoms-toolbox-group", [RandChoiceExpr, RandIntExpr])
        );
        this.toolboxCategories.push(
            new ToolboxCategory("Texts", "text-toolbox-group", [
                StringLiteralExpr,
                FormattedStringLiteralExpr,
                FormattedStringItem,
                SplitMethodMod,
                JoinMethodMod,
                FindMethodMod,
                ReplaceMethodMod,
            ])
        );
        this.toolboxCategories.push(
            new ToolboxCategory("Lists", "list-ops-toolbox-group", [
                ListLiteralExpr,
                ListCommaItem,
                ListIndexAccessor,
                AppendMethodMod,
            ])
        );

        this.toolboxCategories.push(
            new ToolboxCategory("Arithmetics", "arithmetics-toolbox-group", [
                BinAddExpr,
                BinSubExpr,
                BinMultExpr,
                BinDivExpr,
                BinFloorDivExpr,
                BinModExpr,
            ])
        );
        this.toolboxCategories.push(
            new ToolboxCategory("Comparisons", "comparison-ops-toolbox-group", [
                BinCompEqExpr,
                BinCompNeqExpr,
                BinCompLtExpr,
                BinCompLteExpr,
                BinCompGtExpr,
                BinCompGteExpr,
                BinInExpr,
                BinNotInExpr,
            ])
        );
        this.toolboxCategories.push(
            new ToolboxCategory("Booleans", "boolean-ops-toolbox-group", [
                BinAndExpr,
                BinOrExpr,
                UnaryNotExpr,
                BooleanTrueLiteralExpr,
                BooleanFalseLiteralExpr,
            ])
        );
        this.toolboxCategories.push(
            new ToolboxCategory("Converts", "convert-ops-toolbox-group", [CastStrExpr, CastIntExpr])
        );
        this.toolboxCategories.push(new ToolboxCategory("Imports", "import-ops-toolbox-group", [ImportStmt]));
    }

    static instance(): Actions {
        if (!Actions.inst) Actions.inst = new Actions();

        return Actions.inst;
    }
}
