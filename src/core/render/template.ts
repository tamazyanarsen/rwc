// class, attribute, event, effect

import { effect } from "../signal/signal";
import { type BaseComponentConstructor } from "../types/component";

const addClass = (element: HTMLElement, classList: (string | (() => string))[]) => {
    element.classList.add(...classList.filter(value => typeof value === 'string'));
    classList.filter(value => typeof value === 'function').forEach(value => {
        let currValue = '';
        effect(() => {
            if (currValue !== '') element.classList.remove(currValue);
            currValue = value();
            element.classList.add(currValue);
        });
    });
    return element
}

const attrTostring = (value: any) => typeof value === 'string' ? value : JSON.stringify(value);

const setAttribute = <S extends Template<any> | CustomTemplate<any>>(element: HTMLElement, self: S, attribute: string, value: any | ((self: S) => any)) => {
    if (typeof value === 'function') effect(() => element.setAttribute(attribute, attrTostring(value(self))));
    else element.setAttribute(attribute, attrTostring(value));
    return element
}

const append = (element: HTMLElement, ...children: (SomeTemplate | (() => SomeTemplate))[]) => {
    children.forEach(child => {
        if (typeof child === 'function') {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'contents';
            effect(() => {
                while (wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);
                wrapper.appendChild(child().nativeElement);
            });
            element.appendChild(wrapper);
        }
        else element.appendChild(child.nativeElement);
    });
    return element
}

class Template<K extends keyof HTMLElementTagNameMap> {
    private element: HTMLElementTagNameMap[K];

    constructor(private selector: K) {
        this.element = document.createElement(this.selector)
    }

    get nativeElement() {
        return this.element;
    }

    addClassList(classList: (string | (() => string))[]) {
        addClass(this.element, classList);
        return this
    }

    setAttribute(attribute: string, value: any | ((self: Template<K>) => any)) {
        setAttribute(this.element, this, attribute, value);
        return this
    }

    handleEvent(event: `${string}`, callback: (self: Template<K>, e: Event) => void) {
        this.element.addEventListener(event, (e) => callback(this, e));
        return this
    }

    append(...children: (Template<any> | CustomTemplate<any>)[]) {
        append(this.element, ...children);
        return this
    }
}

class CustomTemplate<B extends BaseComponentConstructor> {
    private element: InstanceType<B>;

    constructor(componentConstructor: B) {
        this.element = document.createElement(componentConstructor.selector) as InstanceType<B>;
    }

    get nativeElement() {
        return this.element;
    }

    addClassList(classList: (string | (() => string))[]) {
        addClass(this.element, classList);
        return this
    }

    setAttribute(attribute: string, value: any | ((self: CustomTemplate<B>) => any)) {
        setAttribute(this.element, this, attribute, value);
        return this
    }

    append(...children: (Template<any> | CustomTemplate<any>)[]) {
        append(this.element, ...children);
        return this
    }

    handleEvent(event: `${string}`, callback: (self: CustomTemplate<B>, e: Event) => void) {
        this.element.addEventListener(event, (e) => callback(this, e));
        return this
    }
}

export type SomeTemplate = Template<any> | CustomTemplate<any> | string;

export const createTemplate = <K extends keyof HTMLElementTagNameMap>(selector: K) => new Template(selector);

export const customTemplate = (componentConstructor: BaseComponentConstructor) => new CustomTemplate(componentConstructor);