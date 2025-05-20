// class, attribute, event, effect

import { addClass, append, setHtmlAttribute, type HtmlAttribute, type HtmlAttributeValue } from "./helpers";
import type { BaseTemplate, ElementClassList, SomeContent } from "./render.types";

export type TemplateEvent<K extends keyof HTMLElementTagNameMap, EventKey extends keyof HTMLElementEventMap> = (self: Template<K>, e: HTMLElementEventMap[EventKey]) => void

export class Template<K extends keyof HTMLElementTagNameMap> implements BaseTemplate<HTMLElementTagNameMap[K]> {
    private element: HTMLElementTagNameMap[K];

    constructor(private selector: K) {
        this.element = document.createElement(this.selector)
    }

    get nativeElement() {
        return this.element;
    }

    addClassList(classList: ElementClassList) {
        addClass(this.element, classList);
        return this
    }

    setAttribute<Key extends HtmlAttribute<HTMLElementTagNameMap[K]> & string>(attribute: Key, value: HtmlAttributeValue<this, HTMLElementTagNameMap[K], Key>) {
        setHtmlAttribute(this.element, this, attribute, value);
        return this
    }

    handleEvent<EventKey extends keyof HTMLElementEventMap>(event: EventKey, callback: TemplateEvent<K, EventKey>) {
        this.element.addEventListener(event, (e) => callback(this, e as HTMLElementEventMap[EventKey]));
        return this
    }

    append(...children: SomeContent[]) {
        append(this.element, this, ...children);
        return this
    }
}
