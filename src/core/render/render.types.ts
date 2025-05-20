import type { Signal } from "../types/signal";

export type ElementClassList = (string | (() => string))[];

export interface BaseTemplate<H extends HTMLElement> {
    get nativeElement(): H;
    addClassList(classList: (string | (() => string))[]): this;
    setAttribute(attribute: string, value: any | ((self: this) => any)): this;
    handleEvent(event: string, callback: <T extends BaseTemplate<any>>(self: T, e: Event) => void): this;
    append(...children: SomeContent[]): this;
}

export type SomeTemplate = BaseTemplate<any> | string;
export type SomeContent = SomeTemplate | Signal<SomeTemplate[]> | (<B extends BaseTemplate<any>>(self: B) => SomeTemplate | (SomeTemplate[]));
