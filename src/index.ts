import * as monaco from "monaco-editor";
import "./css/index.css";
import { Module } from "./editor/module";
import * as helperModule from './syntax_check/helper';

// @ts-ignore
self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
        if (label === "json") {
            return "./json.worker.bundle.js";
        }

        if (label === "css" || label === "scss" || label === "less") {
            return "./css.worker.bundle.js";
        }

        if (label === "html" || label === "handlebars" || label === "razor") {
            return "./html.worker.bundle.js";
        }

        if (label === "typescript" || label === "javascript") {
            return "./ts.worker.bundle.js";
        }

        return "./editor.worker.bundle.js";
    },
};

const nova = new Module("editor");
const runBtnToOutputWindow = new Map<string, string>();
runBtnToOutputWindow.set("runCodeBtn", "outputDiv");

var nova_editor = nova.editor.monaco;
var model = nova_editor.getModel();

var err_log = {};
var id = 0;

function updateLineNumber(err_log, event) {
    var steps = event.changes[0].range.startLineNumber - event.changes[0].range.endLineNumber;
    if (steps == 0) {
        if (event.changes[0].text == event.eol && event.changes[0].range.startLineNumber + 1 != model.getLineCount()) steps = 1;
        else return err_log;
    }
    var new_err_log = {}
    for (var line in err_log) {
        var n_line = Number(line)
        if (n_line < event.changes[0].range.startLineNumber) {
            new_err_log[n_line] = err_log[n_line]
        }
        else if (n_line >= event.changes[0].range.endLineNumber) {
            new_err_log[n_line + steps] = err_log[n_line]
        }
        else {

            if (err_log[n_line][0]) monaco.editor.setModelMarkers(model, err_log[n_line][0].toString(), []);
            if (err_log[n_line][1]) monaco.editor.setModelMarkers(model, err_log[n_line][1].toString(), []);
            if (err_log[n_line][2]) monaco.editor.setModelMarkers(model, err_log[n_line][2].toString(), []);
            if (err_log[n_line][3]) monaco.editor.setModelMarkers(model, err_log[n_line][3].toString(), []);
        }
    }
    return new_err_log;
}


function generateErrMsg(errType: number, errID: number,) {
    //asdf
}

function updateErrMsg(errType: number, errID: number, oldLineNumber: number, newLineNumber: number,) {
    //asdf
}

function deleteErrMsg(errType: number) {
    //asdf
}


model.onDidChangeContent((event) => {

    console.log(event)
    err_log = updateLineNumber(err_log, event);
    console.log(err_log)

    var this_line_number = nova_editor.getPosition().lineNumber
    var total_line_number = model.getLineCount();

    if (this_line_number > total_line_number) return;

    var this_line_content = model.getLineContent(this_line_number)

    var err_missing_colon = helperModule.checkMissingColon(this_line_content);
    var err_misplaced_colon = helperModule.find_misplaced_colon(this_line_content);
    var err_parenthesis = helperModule.checkParenthesis(this_line_content);
    var err_import = helperModule.checkImportStatement(this_line_content);


    // remove err msg for solved errors
    if (err_log[this_line_number] != undefined) {

        if (err_missing_colon == -1 && err_log[this_line_number][0] != undefined) {
            monaco.editor.setModelMarkers(model, err_log[this_line_number][0].toString(), []);
            err_log[this_line_number][0] = undefined;
        }
        if (err_misplaced_colon == -1 && err_log[this_line_number][1] != undefined) {
            monaco.editor.setModelMarkers(model, err_log[this_line_number][1].toString(), []);
            err_log[this_line_number][1] = undefined;
        }
        if (err_parenthesis == -1 && err_log[this_line_number][2] != undefined) {
            monaco.editor.setModelMarkers(model, err_log[this_line_number][2].toString(), []);
            err_log[this_line_number][2] = undefined;
        }
        if (err_import == -1 && err_log[this_line_number][3] != undefined) {
            monaco.editor.setModelMarkers(model, err_log[this_line_number][3].toString(), []);
            err_log[this_line_number][3] = undefined;
        }
    }

    // boolean: true if line is free of ANY error
    var noError = (err_missing_colon + err_misplaced_colon + err_parenthesis + err_import) == -4;

    if (!noError) {
        if (err_log[this_line_number] == undefined) err_log[this_line_number] = [];

        if (err_missing_colon != -1) {
            var temp_id;
            if (err_log[this_line_number][0] == undefined) {
                temp_id = id.toString();
                err_log[this_line_number][0] = id;
                id++;
            }
            else temp_id = err_log[this_line_number][0].toString();

            monaco.editor.setModelMarkers(model, temp_id, [{
                startLineNumber: this_line_number,
                startColumn: err_missing_colon,
                endLineNumber: this_line_number,
                endColumn: err_missing_colon + 1,
                message: "You are missing a colon (:) in this compound statement!",
                severity: monaco.MarkerSeverity.Warning
            }])
        }

        if (err_misplaced_colon != -1) {
            var temp_id;
            if (err_log[this_line_number][1] == undefined) {
                temp_id = id.toString();
                err_log[this_line_number][1] = id;
                id++;
            }
            else temp_id = err_log[this_line_number][1].toString();

            monaco.editor.setModelMarkers(model, temp_id, [{
                startLineNumber: this_line_number,
                startColumn: err_misplaced_colon + 1,
                endLineNumber: this_line_number,
                endColumn: err_misplaced_colon + 2,
                message: "There should not be a colon (:) here!",
                severity: monaco.MarkerSeverity.Warning
            }])
        }

        if (err_parenthesis != -1) {
            var temp_id;
            if (err_log[this_line_number][2] == undefined) {
                temp_id = id.toString();
                err_log[this_line_number][2] = id;
                id++;
            }
            else temp_id = err_log[this_line_number][2].toString();
            monaco.editor.setModelMarkers(model, temp_id, [{
                startLineNumber: this_line_number,
                startColumn: err_parenthesis,
                endLineNumber: this_line_number,
                endColumn: err_parenthesis + 1,
                message: "This parenthesis is left unmatched!",
                severity: monaco.MarkerSeverity.Warning
            }])

        }

        if (err_import != -1) {
            var temp_id;
            if (err_log[this_line_number][3] == undefined) {
                temp_id = id.toString();
                err_log[this_line_number][3] = id;
                id++;
            }
            else temp_id = err_log[this_line_number][3].toString();
            monaco.editor.setModelMarkers(model, temp_id, [{
                startLineNumber: this_line_number,
                startColumn: err_import + 1,
                endLineNumber: this_line_number,
                endColumn: 999,
                message: "Import",
                severity: monaco.MarkerSeverity.Warning
            }])

        }

    }

});

export { nova, runBtnToOutputWindow };

