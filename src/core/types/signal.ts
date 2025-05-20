export type Signal<T> = {
    (): T,
    set: (newValue: T) => void,
    forceSet: (newValue: T) => void
}

export const isSignal = <T>(value: any): value is Signal<T> => {
    return typeof value === 'function' && typeof value.set === 'function' && typeof value.forceSet === 'function'
}

export type InferSignal<T> = T extends Signal<infer U> ? U : T;