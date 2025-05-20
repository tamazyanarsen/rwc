const effectStack: (() => void)[] = []



export const signal = <T>(initialValue: T) => {
    const subscribers = new Set<Function>();

    let value: T = initialValue;

    const result = () => {
        subscribers.add(effectStack[effectStack.length - 1])
        return value
    }
    result.set = (newValue: T) => {
        if (value === newValue) return;
        value = newValue
        subscribers.forEach(subscriber => subscriber(value))
    }
    result.forceSet = (newValue: T) => {
        value = newValue
        subscribers.forEach(subscriber => subscriber(value))
    }

    return result

}

export const effect = (fn: () => void) => {
    effectStack.push(fn)
    fn()
    effectStack.pop()
}

export const computed = <T>(fn: () => T) => {
    const result = signal(fn())
    effect(() => result.set(fn()))
    return result
}
