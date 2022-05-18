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

    /*
    Start new line: steps==0 && event.changes[0].text.includes(event.eol)
    Remove new line: steps==-1

    */

    var steps = event.changes[0].range.startLineNumber - event.changes[0].range.endLineNumber;

    if (steps == 0) {
        if (event.changes[0].text.includes(event.eol) && event.changes[0].range.startLineNumber + 1 != model.getLineCount()) steps = 1;
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
            console.log(steps)
            if (err_log[n_line][0]) updateErrMsg(0, n_line, n_line + steps)
            if (err_log[n_line][1]) updateErrMsg(1, n_line, n_line + steps)
            if (err_log[n_line][2]) updateErrMsg(2, n_line, n_line + steps)
            if (err_log[n_line][3]) updateErrMsg(3, n_line, n_line + steps)
            console.log(monaco.editor.getModelMarkers({}));
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


function generateErrMsg(errType: number, lineNumber: number, startIndex: number) {

    if (err_log[lineNumber] == undefined) err_log[lineNumber] = [];

    var temp_id: string;
    if (err_log[lineNumber][errType] == undefined) {
        temp_id = id.toString();
        err_log[lineNumber][errType] = id;
        id++;
    }
    else temp_id = err_log[lineNumber][errType].toString();

    switch (errType) {
        case 0:
            monaco.editor.setModelMarkers(model, temp_id, [{
                startLineNumber: lineNumber,
                startColumn: startIndex,
                endLineNumber: lineNumber,
                endColumn: startIndex + 1,
                message: "You are missing a colon (:) in this compound statement!",
                severity: monaco.MarkerSeverity.Warning
            }])
            break;
        case 1:
            monaco.editor.setModelMarkers(model, temp_id, [{
                startLineNumber: lineNumber,
                startColumn: startIndex + 1,
                endLineNumber: lineNumber,
                endColumn: startIndex + 2,
                message: "There should not be a colon (:) here!",
                severity: monaco.MarkerSeverity.Warning
            }])
            break;
        case 2:
            monaco.editor.setModelMarkers(model, temp_id, [{
                startLineNumber: lineNumber,
                startColumn: startIndex,
                endLineNumber: lineNumber,
                endColumn: startIndex + 1,
                message: "This parenthesis is left unmatched!",
                severity: monaco.MarkerSeverity.Warning
            }])
            break;
        case 3:
            monaco.editor.setModelMarkers(model, temp_id, [{
                startLineNumber: lineNumber,
                startColumn: startIndex + 1,
                endLineNumber: lineNumber,
                endColumn: 999,
                message: "Failed to import!",
                severity: monaco.MarkerSeverity.Warning
            }])
            break;
    }

}

function updateErrMsg(errType: number, oldLineNumber: number, newlineNumber: number) {

    var oldMarker = monaco.editor.getModelMarkers({ 'owner': err_log[oldLineNumber][errType].toString() })[0]

    switch (errType) {
        case 0:
            monaco.editor.setModelMarkers(model, err_log[oldLineNumber][errType].toString(), [{
                startLineNumber: newlineNumber,
                startColumn: oldMarker.startColumn,
                endLineNumber: newlineNumber,
                endColumn: oldMarker.startColumn + 1,
                message: "You are missing a colon (:) in this compound statement!",
                severity: monaco.MarkerSeverity.Warning
            }])
            break;
        case 1:
            monaco.editor.setModelMarkers(model, err_log[oldLineNumber][errType].toString(), [{
                startLineNumber: newlineNumber,
                startColumn: oldMarker.startColumn,
                endLineNumber: newlineNumber,
                endColumn: oldMarker.startColumn + 1,
                message: "There should not be a colon (:) here!",
                severity: monaco.MarkerSeverity.Warning
            }])
            break;
        case 2:
            monaco.editor.setModelMarkers(model, err_log[oldLineNumber][errType].toString(), [{
                startLineNumber: newlineNumber,
                startColumn: oldMarker.startColumn,
                endLineNumber: newlineNumber,
                endColumn: oldMarker.startColumn + 1,
                message: "This parenthesis is left unmatched!",
                severity: monaco.MarkerSeverity.Warning
            }])
            break;
        case 3:
            monaco.editor.setModelMarkers(model, err_log[oldLineNumber][errType].toString(), [{
                startLineNumber: newlineNumber,
                startColumn: oldMarker.startColumn,
                endLineNumber: newlineNumber,
                endColumn: 999,
                message: "Failed to import!",
                severity: monaco.MarkerSeverity.Warning
            }])
            break;
    }


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

    // return if line is free of errors
    if ((err_missing_colon + err_misplaced_colon + err_parenthesis + err_import) == -4) return;

    if (err_missing_colon != -1) {
        generateErrMsg(0, this_line_number, err_missing_colon)
    }

    if (err_misplaced_colon != -1) {
        generateErrMsg(1, this_line_number, err_misplaced_colon)
    }

    if (err_parenthesis != -1) {
        generateErrMsg(2, this_line_number, err_parenthesis)
    }

    if (err_import != -1) {
        generateErrMsg(3, this_line_number, err_import)
    }

});

export { nova, runBtnToOutputWindow };

