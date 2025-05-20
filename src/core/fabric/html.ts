import { createTemplate } from "../render/template";

type Fabric = {
    [key in keyof HTMLElementTagNameMap]: ReturnType<typeof createTemplate<key>>['append']
}

const fabric: Fabric = new Proxy(
    {} as Fabric,
    {
        get<K extends keyof HTMLElementTagNameMap>(
            _: Fabric,
            prop: K
        ) {
            return createTemplate(prop).append;
        }
    }
);

export const {
    div, span, p, a, img, ul, li, h1, h2, h3, h4, h5, h6, button, input, textarea, label, form, select, option, article, aside, audio, b, base, bdi, bdo, blockquote, body, br, canvas, caption, cite, code, col, colgroup, data, datalist, dd, del, details, dfn, dialog, dl, dt, em, embed, fieldset, figcaption, figure, footer, head, header, hgroup, hr, html, i, iframe, ins, kbd, legend, main, map, mark, menu, meta, meter, nav, noscript, object, ol, optgroup, output, picture, pre, progress, q, rp, rt, ruby, s, samp, script, section, small, source, strong, style, sub, summary, sup, table, tbody, td, template, tfoot, th, thead, time, title, tr, track, u, video, wbr
} = fabric;
