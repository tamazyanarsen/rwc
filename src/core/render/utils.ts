import { isSignal, type Signal } from "../types"
import type { SomeTemplate } from "./render.types"

export const when = (condition: Signal<boolean> | boolean, trueContent: SomeTemplate, falseContent?: SomeTemplate) => {
    if (isSignal(condition)) {
        return () => condition() ? trueContent : falseContent || ''
    }
    return () => condition ? trueContent : falseContent || ''
}
