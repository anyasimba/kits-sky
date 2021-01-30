import * as __ from './_'
import { link } from './@@link'

export type belongs = typeof belongs
export function belongs<T>(prototype: T, propertyKey: string, descriptor: PropertyDescriptor) {
    const key = propertyKey.split(':')
    const privateKey = key[0] || Symbol(key[1])

    Object.defineProperty(prototype, key[1], {
        configurable: false,
        enumerable: false,
        get() {
            return this[privateKey]
        },
        set(host) {
            const current = this[privateKey]
            if (current) {
                const relations = this[__.$$relations].get(current)
                for (let i = 0; i < relations.length; i++) {
                    relations[i]()
                }
                this[__.$$relations].delete(current)
                this[privateKey] = null
            }
            if (host != null) {
                this[privateKey] = host
                ;(link.constructor as any).host = host
                ;(link.constructor as any).connector = this
                descriptor.value.call(this, host)
            }
        },
    })
}
