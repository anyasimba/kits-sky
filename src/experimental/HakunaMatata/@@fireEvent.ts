export type fireEvent = typeof fireEvent
export function fireEvent(object: any, name: string, ...args) {
    if (object[name]) {
        return object[name](...args)
    }
    if (object.fireEvent) {
        return object.fireEvent(name, ...args)
    }
    return
}
