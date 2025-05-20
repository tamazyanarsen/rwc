import type { SomeTemplate } from "../render";
import type { Signal } from "./signal";

export abstract class BaseComponent extends HTMLElement {
    static selector: string;
    props?: Record<string, Signal<any>>;
    events?: Record<string, EventEmitter<any>>;

    constructor() {
        super();
    }

    abstract render(): SomeTemplate;
}

export type BaseComponentConstructor = {
    new(): BaseComponent;
    selector: string;
}

export type EventEmitter<T> = (value: T | Signal<T>) => void;