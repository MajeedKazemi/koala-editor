import { Editor } from "./editor";
import { ToolboxController } from "./toolbox";

export class Module {
    editor: Editor;
    toolboxController: ToolboxController;
    globals: { hoveringOverCascadedMenu: boolean; hoveringOverVarRefButton: boolean; lastPressedRunButtonId: string };

    constructor(editorId: string) {
        this.editor = new Editor(document.getElementById(editorId));
        this.toolboxController = new ToolboxController(this);

        this.toolboxController.loadToolboxFromJson();
        this.toolboxController.addTooltips();

        this.globals = {
            hoveringOverCascadedMenu: false,
            hoveringOverVarRefButton: false,
            lastPressedRunButtonId: "",
        };
    }
}
