export const camelToKebab = (v: string) => v.replace(/([A-Z])/gm, v => `-${v.toLowerCase()}`)
export const kebabToCamel = (v: string) => v.replace(/-(\w)/gm, (_, v) => v.toUpperCase())
