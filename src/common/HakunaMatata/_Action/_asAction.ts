export function asAction<T extends any[], R>(mode: ActionMode, fn: (...args: T) => R) {
    ;(fn as any).mode = mode
    return fn
}
