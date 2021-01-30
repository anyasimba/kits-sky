import * as __ from './_'

export type alive = typeof alive
export function alive<T>(
    prototype: T,
    propertyKey: string | symbol,
    propertyDescriptor?: PropertyDescriptor
): PropertyDescriptor {
    if (propertyDescriptor) {
        return propertyDescriptor
    }

    const key =
        typeof propertyKey === 'symbol' ? Symbol(propertyKey.toString()) : Symbol(propertyKey)

    return {
        configurable: false,
        enumerable: false,
        get() {
            return this[key]
        },
        set(object) {
            const current = this[key]
            if (current) {
                current[__.$$detachAliveProp](this)
                this[key] = null
            }
            if (object != null) {
                object[__.$$attachAliveProp]([
                    this,
                    () => {
                        this[key] = null
                    },
                ])
                this[key] = object
            }
        },
    }
}
