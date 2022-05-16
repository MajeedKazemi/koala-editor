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

var editor = nova.editor.monaco;
var model = editor.getModel();
model.onDidChangeContent((event) => {

    var this_line = model.getLineContent(editor.getPosition().lineNumber)

    var out = helperModule.checkMissingColon(this_line);

    console.log(out);

});

export { nova, runBtnToOutputWindow };

