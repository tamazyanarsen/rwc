import { convertTemplateToHtml, CustomTemplate, Template, type CustomTemplateEvent, type ElementClassList, type SomeContent, type SomeTemplate } from "../render";
import { effect, signal } from "../signal";
import { BaseComponent, isSignal, type EventEmitter, type InferSignal, type Signal } from "../types";
import { camelToKebab, kebabToCamel } from "../utils/helpers";

type EmitterValue<E extends EventEmitter<any>> = E extends EventEmitter<infer T> ? T : never;

export const newEventEmitter = <T>(): EventEmitter<T> => (_value: T | Signal<T>) => { }

export function createComponent<
    Props extends Record<string, Signal<any>>,
    Events extends Record<string, EventEmitter<any>>
>(config: {
    selector: string,
    props?: Props,
    events?: Events,
    css?: string
}, render: (props: Props, events: Events) => SomeTemplate) {
    class CustomElement extends BaseComponent {
        static selector = config.selector;
        static observedAttributes = Object.keys(config.props || {}).map(camelToKebab);

        shadow: ShadowRoot;

        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: 'closed' });
            const css = new CSSStyleSheet();
            css.replaceSync(config.css || '');
            this.shadow.adoptedStyleSheets = [css];
        }

        props = Object.fromEntries(Object.entries(config.props || {}).map(([key, value]) => [key, signal(value())])) as Props;
        events = Object.fromEntries(Object.entries(config.events || {}).map(([key, emitter]) => [
            key,
            (value: Parameters<typeof emitter>[0]) => effect(() => this.dispatchEvent(
                new CustomEvent<EmitterValue<typeof emitter>>(key, { detail: isSignal(value) ? value() : value })
            ))
        ])) as unknown as Events;

        attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
            const propName = kebabToCamel(name)
            if (this.props?.[propName]) {
                this.props[propName].set(newValue);
            }
        }

        connectedCallback() {
            this.shadow.appendChild(convertTemplateToHtml(this.render()))
        }

        render() {
            return render(this.props, this.events)
        }
    }

    type Config = {
        classNameItems?: ElementClassList;
    } & Partial<{
        [key in keyof Props as `.${key & string}`]: InferSignal<Props[key]>
    }> & Partial<{
        [key in keyof Events as `@${key & string}`]: CustomTemplateEvent<typeof CustomElement, key>
    }>

    customElements.define(config.selector, CustomElement);
    return (config?: Config | SomeContent, ...items: SomeContent[]) => {
        const isConfig = (
            value?: Config | SomeContent
        ): value is Config => !(typeof value === 'string' || value instanceof Template || value instanceof CustomTemplate)
        const customTemplate = new CustomTemplate(CustomElement);
        const newItems = [...items];
        if (isConfig(config)) {
            customTemplate.addClassList(config.classNameItems || []);
            Object.entries(config).forEach(([key, value]) => {
                if (key.startsWith('.')) {
                    if (value)
                        customTemplate.setAttribute(camelToKebab(key.slice(1)), value as any);
                } else if (key.startsWith('@')) {
                    customTemplate.handleEvent(key.slice(1), value as any);
                }

            });
        } else if (config) newItems.unshift(config)
        return customTemplate.append(...newItems);
    }
}