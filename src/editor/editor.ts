import { editor } from "monaco-editor";

export class Editor {
    monaco: editor.IStandaloneCodeEditor;

    constructor(parentEl: HTMLElement) {
        this.monaco = editor.create(parentEl, {
            language: "python",
            dimension: { height: 500, width: 700 },
            minimap: {
                enabled: false,
            },
            automaticLayout: true,
            scrollbar: {
                vertical: "auto",
                horizontal: "auto",
                verticalSliderSize: 5,
                horizontalSliderSize: 5,
                scrollByPage: false,
            },
            fontSize: 20,
            lineHeight: 30,
        });
    }
}
