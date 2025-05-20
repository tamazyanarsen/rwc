import type { BaseComponentConstructor, EventEmitter } from "../types";
import { addClass, append, setCustomAttribute, type CustomHtmlAttribute, type CustomHtmlAttributeValue } from "./helpers";
import type { BaseTemplate, ElementClassList, SomeContent } from "./render.types";

export class CustomTemplate<B extends BaseComponentConstructor> implements BaseTemplate<InstanceType<B>> {
    private element: InstanceType<B>;

    constructor(componentConstructor: B) {
        this.element = document.createElement(componentConstructor.selector) as InstanceType<B>;
    }

    get nativeElement() {
        return this.element;
    }

    addClassList(classList: ElementClassList) {
        addClass(this.element, classList);
        return this
    }

    setAttribute<Key extends CustomHtmlAttribute<InstanceType<B>> & string>(
        attribute: Key,
        value: CustomHtmlAttributeValue<this, InstanceType<B>, Key>
    ) {
        setCustomAttribute(this.element, this, attribute, value);
        return this
    }

    append(...children: SomeContent[]) {
        append(this.element, this, ...children);
        return this
    }

    handleEvent<EventKey extends keyof InstanceType<B>['events']>(
        event: EventKey & string,
        callback: CustomTemplateEvent<B, EventKey>
    ) {
        this.element.addEventListener(event, (e) => callback(this, e as CustomEvent<
            keyof InstanceType<B>['events'][EventKey] extends EventEmitter<infer T> ? T : never
        >));
        return this
    }
}

export type CustomEventKeys<Custom extends CustomTemplate<any>> = {
    [key in keyof Custom]: Custom[key] extends EventEmitter<any> ? key : never
}[keyof Custom];

export type CustomTemplateEvent<
    B extends BaseComponentConstructor,
    EventKey extends keyof InstanceType<B>['events']
> = (self: CustomTemplate<B>, e: CustomEvent<
    keyof InstanceType<B>['events'][EventKey] extends EventEmitter<infer T> ? T : never
>) => void