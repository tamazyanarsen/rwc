import { CustomTemplate, Template, type ElementClassList, type SomeContent, type TemplateEvent } from "../render";

type Fabric = {
    [key in keyof HTMLElementTagNameMap]: (
        config?: Config<key, HTMLElementTagNameMap[key]> | SomeContent,
        ...items: SomeContent[]
    ) => Template<key>
}

type Config<K extends keyof HTMLElementTagNameMap, E extends HTMLElementTagNameMap[K]> = {
    classNameItems?: ElementClassList;
} & Partial<{
    [key in keyof E as `.${string & key}`]?: E[key]
}> & Partial<{
    [key in keyof HTMLElementEventMap as `@${string & key}`]?: TemplateEvent<K, key>
}>

export const cls = (strings: TemplateStringsArray, ...values: ElementClassList): Config<any, any> => {
    return {
        classNameItems: [...strings, ...values]
    }
}

const fabric: Fabric = new Proxy(
    {} as Fabric,
    {
        get<K extends keyof HTMLElementTagNameMap>(
            _: Fabric,
            prop: K
        ) {
            return (config?: Config<K, HTMLElementTagNameMap[K]> | SomeContent, ...items: SomeContent[]) => {
                const isConfig = (
                    value?: Config<K, HTMLElementTagNameMap[K]> | SomeContent
                ): value is Config<K, HTMLElementTagNameMap[K]> => !(typeof value === 'string' || value instanceof Template || value instanceof CustomTemplate)
                const renderTemplate = new Template(prop);
                const newItems = [...items];
                if (isConfig(config)) {
                    renderTemplate.addClassList(config.classNameItems || []);
                    Object.entries(config).forEach(([key, value]) => {
                        if (key.startsWith('.')) {
                            const newKey = key.slice(1) as keyof HTMLElementTagNameMap[K] & string;
                            renderTemplate.setAttribute(newKey,
                                value as HTMLElementTagNameMap[K][typeof newKey] | ((self: Template<K>) => HTMLElementTagNameMap[K][typeof newKey])
                            );
                        } else if (key.startsWith('@')) {
                            const newKey = key.slice(1) as keyof HTMLElementEventMap & string;
                            renderTemplate.handleEvent(newKey, value as TemplateEvent<K, typeof newKey>);
                        }
                    });
                } else if (config) newItems.unshift(config)
                return renderTemplate.append(...newItems);
            }
        }
    }
);

export const {
    div, span, p, a, img, ul, li, h1, h2, h3, h4, h5, h6, button, input, textarea, label, form, select, option, article, aside, audio, b, base, bdi, bdo, blockquote, body, br, canvas, caption, cite, code, col, colgroup, data, datalist, dd, del, details, dfn, dialog, dl, dt, em, embed, fieldset, figcaption, figure, footer, head, header, hgroup, hr, html, i, iframe, ins, kbd, legend, main, map, mark, menu, meta, meter, nav, noscript, object, ol, optgroup, output, picture, pre, progress, q, rp, rt, ruby, s, samp, script, section, small, source, strong, style, sub, summary, sup, table, tbody, td, template, tfoot, th, thead, time, title, tr, track, u, video, wbr
} = fabric;
