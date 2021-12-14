import { CodeConstruct, Expression, Modifier } from "./ast";
import { Actions, EditCodeAction } from "./consts";
import { DocumentationBox } from "./doc-box";
import { Module } from "./module";

export const EDITOR_DOM_ID = "editor";

export class ToolboxController {
    static draftModeButtonClass = "button-draft-mode";
    static invalidButtonClass = "button-invalid";
    static validButtonClass = "button-valid";

    module: Module;

    constructor(module: Module) {
        this.module = module;
    }

    addTooltips() {
        const toolboxCategories = Actions.instance().toolboxCategories;

        for (const constructGroup of toolboxCategories) {
            for (const item of constructGroup.items) {
                const button = document.getElementById(item.id);

                button.addEventListener("mouseover", () => {
                    const tooltipId = `tooltip-${item.id}`;

                    if (!document.getElementById(tooltipId)) {
                        const tooltip = this.createTooltip(item);
                        tooltip.id = tooltipId;

                        tooltip.style.left = `${button.getBoundingClientRect().right + 10}px`;
                        tooltip.style.top = `${button.getBoundingClientRect().top}px`;
                        tooltip.style.display = "block";

                        button.addEventListener("click", () => {
                            tooltip.remove();
                        });

                        setTimeout(() => {
                            tooltip.style.opacity = "1";
                        }, 1);

                        button.addEventListener("mouseleave", () => {
                            setTimeout(() => {
                                if (tooltip && !tooltip.matches(":hover") && !button.matches(":hover")) {
                                    tooltip.style.opacity = "0";

                                    setTimeout(() => {
                                        tooltip.remove();
                                    }, 100);
                                }
                            }, 100);
                        });

                        tooltip.addEventListener("mouseleave", () => {
                            if (tooltip && !tooltip.matches(":hover") && !button.matches(":hover")) {
                                tooltip.style.opacity = "0";

                                setTimeout(() => {
                                    tooltip.remove();
                                }, 100);
                            }
                        });
                    }
                });
            }
        }
    }

    private createTooltip(code: EditCodeAction): HTMLDivElement {
        const returnType = code.getUserFriendlyReturnType();

        const tooltipContainer = document.createElement("div");
        tooltipContainer.classList.add("tooltip-container");
        document.body.appendChild(tooltipContainer);

        const tooltipTop = document.createElement("div");
        tooltipTop.classList.add("tooltip-top");
        tooltipContainer.appendChild(tooltipTop);

        const tooltipHeader = document.createElement("div");
        tooltipHeader.classList.add("tooltip-header");
        const tooltipText = document.createElement("p");
        tooltipText.classList.add("tooltip-text");

        if (code.documentation.tooltip) {
            tooltipHeader.innerHTML = `<h4>${code.documentation.tooltip.title}</h4>`;
            tooltipTop.appendChild(tooltipHeader);

            tooltipText.innerText = code.documentation.tooltip.body;
            tooltipTop.appendChild(tooltipText);
        }

        if (code.documentation.useCases) {
            for (const useCase of code.documentation.useCases) {
                const useCaseSlider = this.createUseCaseSlider(useCase.path, useCase.max, useCase.extension);

                tooltipContainer.appendChild(useCaseSlider);
            }
        }

        if (returnType) {
            const typeText = document.createElement("div");
            typeText.classList.add("return-type-text");
            typeText.innerHTML = `returns <span class="return-type">${returnType}</span>`;

            tooltipTop.appendChild(typeText);
        }
        if (code.documentation) {
            const learnButton = document.createElement("div");
            learnButton.classList.add("learn-button");
            learnButton.innerText = "learn more >";
            tooltipHeader.appendChild(learnButton);

            learnButton.onclick = () => {
                const doc = new DocumentationBox(code.documentation, code.documentation);
            };
        }

        return tooltipContainer;
    }

    private createUseCaseSlider(path: string, max: number, extension: string): HTMLDivElement {
        const sliderContainer = document.createElement("div");
        sliderContainer.classList.add("slider-container");
        const slider = document.createElement("input");
        slider.classList.add("range-slider");
        slider.type = "range";
        slider.min = "1";
        slider.max = max.toString();
        slider.value = "1";

        sliderContainer.append(slider);

        const slides = [];

        for (let i = 1; i < max + 1; i++) {
            slides.push(`${path}${i}.${extension}`);
        }

        const slideImage = document.createElement("img");
        sliderContainer.append(slideImage);
        slideImage.classList.add("slider-image");
        slideImage.src = slides[0];

        slider.oninput = () => {
            slideImage.src = slides[parseInt(slider.value) - 1];
        };

        return sliderContainer;
    }

    loadToolboxFromJson() {
        const toolboxDiv = document.getElementById("editor-toolbox");
        const toolboxMenu = document.getElementById("toolbox-menu");
        const staticDummySpace = document.getElementById("static-toolbox-dummy-space");

        const toolboxCategories = Actions.instance().toolboxCategories;

        for (const constructGroup of toolboxCategories) {
            if (constructGroup) {
                let categoryDiv;

                categoryDiv = document.createElement("div");
                categoryDiv.id = constructGroup.id;
                categoryDiv.classList.add("group");

                const p = document.createElement("p");
                p.textContent = constructGroup.displayName;
                categoryDiv.appendChild(p);

                for (const item of constructGroup.items) {
                    const button = ToolboxButton.createToolboxButtonFromJsonObj(item);

                    categoryDiv.appendChild(button.container);
                }

                toolboxDiv.insertBefore(categoryDiv, staticDummySpace);

                const menuButton = document.createElement("div");
                menuButton.classList.add("menu-button");
                menuButton.innerText = constructGroup.displayName;

                menuButton.addEventListener("click", () => {
                    document.getElementById(constructGroup.id).scrollIntoView({ behavior: "smooth" });
                });

                toolboxMenu.appendChild(menuButton);
            }
        }

        staticDummySpace.style.minHeight = `${
            toolboxDiv.clientHeight - toolboxDiv.children[toolboxDiv.children.length - 2].clientHeight - 20
        }px`;
    }
}

export class ToolboxButton {
    container: HTMLDivElement;

    constructor(text: string, domId?: string, code?: CodeConstruct) {
        this.container = document.createElement("div");
        this.container.classList.add("var-button-container");

        const button = document.createElement("div");
        button.classList.add("button");

        if (!(code instanceof Expression) && !(code instanceof Modifier)) {
            button.classList.add("statement-button");
        } else if (code instanceof Modifier) {
            button.classList.add("modifier-button");
        } else if (code instanceof Expression) {
            button.classList.add("expression-button");
        }

        this.container.appendChild(button);

        if (domId) button.id = domId;

        let htmlText = text.replace(/---/g, "<hole1></hole1>");
        htmlText = htmlText.replace(/--/g, "<hole2></hole2>");
        htmlText = htmlText.trim().replace(/ /g, "&nbsp");
        button.innerHTML = htmlText;
    }

    getButtonElement(): Element {
        return this.container.getElementsByClassName("button")[0];
    }

    removeFromDOM() {
        this.container.remove();
    }

    static createToolboxButtonFromJsonObj(action: EditCodeAction) {
        return new ToolboxButton(action.name, action.id, action.getCode());
    }
}

window.onresize = () => {
    const staticDummySpace = document.getElementById("static-toolbox-dummy-space");

    staticDummySpace.style.minHeight = `${
        staticDummySpace.parentElement.clientHeight -
        staticDummySpace.parentElement.children[staticDummySpace.parentElement.children.length - 2].clientHeight -
        20
    }px`;
};
