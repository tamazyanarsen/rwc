import { BaseComponent } from "../types/component";

export function createComponent<
    Props extends Record<string, any>,
    Events extends Record<string, (eventDetailValue: any) => void>
>(config: {
    selector: string,
    props: Props,
    events: Events
}, render: (props: Props, events: Events) => any) {
    class CustomElement extends BaseComponent {
        render() {
            render(config.props, config.events)
        }
    }

    customElements.define(config.selector, CustomElement);
    return CustomElement;
}