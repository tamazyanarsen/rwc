import { effect } from "../signal";
import { isSignal, type BaseComponent, type InferSignal } from "../types";
import type { BaseTemplate, ElementClassList, SomeContent, SomeTemplate } from "./render.types";

export const addClass = (element: HTMLElement, classList: ElementClassList) => {
    element.classList.add(...classList.filter(value => typeof value === 'string').map(e => e.trim()).filter(Boolean));
    classList.filter(value => typeof value === 'function').forEach(value => {
        let currValue = '';
        effect(() => {
            if (currValue !== '') element.classList.remove(currValue);
            currValue = value();
            if (currValue) element.classList.add(currValue);
        });
    });
    return element
}

const valueToString = (value: any) => typeof value === 'string' ? value : JSON.stringify(value);

export type HtmlAttribute<H extends HTMLElement> = keyof H;
export type HtmlAttributeValue<
    S extends BaseTemplate<any>,
    H extends HTMLElement,
    Key extends HtmlAttribute<H>
> = H[Key] | ((self: S) => H[Key]);

export type CustomHtmlAttribute<H extends BaseComponent> = keyof H['props'];
export type CustomHtmlAttributeValue<
    S extends BaseTemplate<any>,
    H extends BaseComponent,
    Key extends CustomHtmlAttribute<H>
> = InferSignal<H['props'][Key]> | ((self: S) => InferSignal<H['props'][Key]>);

const isAttrFunction = <
    S extends BaseTemplate<any>,
    H extends HTMLElement,
    Key extends HtmlAttribute<H>
>(value: HtmlAttributeValue<S, H, Key>): value is ((self: S) => H[Key]) => {
    return typeof value === 'function'
}
const isCustomAttrFunction = <
    S extends BaseTemplate<any>,
    H extends BaseComponent,
    Key extends CustomHtmlAttribute<H>
>(value: CustomHtmlAttributeValue<S, H, Key>): value is ((self: S) => InferSignal<H['props'][Key]>) => {
    return typeof value === 'function'
}

export const setHtmlAttribute = <
    S extends BaseTemplate<any>,
    H extends HTMLElement,
    Keys extends HtmlAttribute<H>
>(element: H, self: S, attribute: Keys & string, value: HtmlAttributeValue<S, H, Keys>) => {
    if (isAttrFunction(value)) effect(() => element.setAttribute(attribute, valueToString(value(self))));
    else element.setAttribute(attribute, valueToString(value));
    return element
}

export const setCustomAttribute = <
    S extends BaseTemplate<any>,
    H extends BaseComponent,
    Keys extends CustomHtmlAttribute<H>
>(element: H, self: S, attribute: Keys & string, value: CustomHtmlAttributeValue<S, H, Keys>) => {
    if (isCustomAttrFunction(value)) effect(() => element.setAttribute(attribute, valueToString(value(self))));
    else element.setAttribute(attribute, valueToString(value));
    return element
}



const clearElement = (element: HTMLElement) => {
    while (element.firstChild) element.removeChild(element.firstChild);
    return element
}

export const convertTemplateToHtml = (template: SomeTemplate) => {
    if (typeof template === 'string') return new Text(template);
    else return template.nativeElement;
}

export const append = <B extends BaseTemplate<any>>(element: HTMLElement, self: B, ...children: SomeContent[]) => {
    const appendItems = (targetEl: HTMLElement, ...items: SomeTemplate[]) => {
        items.forEach(item => {
            targetEl.appendChild(convertTemplateToHtml(item));
        })
        return targetEl
    }
    children.forEach(child => {
        if (isSignal(child)) {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'contents';
            effect(() => {
                clearElement(wrapper);
                appendItems(wrapper, valueToString(child()))
                // wrapper.appendChild(new Text(valueToString(child())));
            });
            element.appendChild(wrapper);
        }
        else if (typeof child === 'function') {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'contents';
            effect(() => {
                clearElement(wrapper);
                const functionContent = child(self)
                appendItems(
                    wrapper,
                    ...(Array.isArray(functionContent) ? functionContent : [functionContent])
                )
            });
            element.appendChild(wrapper);
        }
        else {
            appendItems(element, child);
        };
    });
    return element
}