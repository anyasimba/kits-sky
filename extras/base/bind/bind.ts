export type bind = typeof bind
export function bind<T extends Function>(
    target: object,
    propName: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> | void {
    return {
        configurable: true,
        get(this: T): T {
            const value = descriptor.value.bind(this)
            Object.defineProperty(this, propName, {
                value,
                configurable: true,
                writable: true,
            })
            return value
        },
    }
}
