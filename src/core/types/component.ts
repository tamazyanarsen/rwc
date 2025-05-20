export abstract class BaseComponent extends HTMLElement {
    static selector: string;

    constructor() {
        super();
        this.attachShadow({ mode: 'closed' });
    }

    abstract render(): any;
}

export type BaseComponentConstructor = {
    new(): BaseComponent;
    selector: string;
}