import { propertyDecorator } from '@skyplay19/helpers'
import { $$native, pointer, wraps } from './__'

declare const global: any

export function applyProp(name: string, prototype: any, prop: any) {
    const get = global.___NATIVE[`${name}_get_${prop.key}`]
    const set = global.___NATIVE[`${name}_set_${prop.key}`]
    if (prop.type.indexOf('*') !== -1) {
        propertyDecorator(() => ({
            configurable: true,
            enumerable: true,
            get() {
                return wraps[get((this as any)[$$native])]
            },
            set(value) {
                const currentPointer = pointer(get((this as any)[$$native]))
                if (currentPointer !== 0) {
                    ;(this as any).remove(wraps[currentPointer])
                }
                if (value) {
                    ;(value as any).__attachTo(this, () => set((this as any)[$$native], null))
                    ;(this as any).__childs.push(value)
                    set((this as any)[$$native], value[$$native])
                } else {
                    set((this as any)[$$native], null)
                }
            },
        }))(prototype, prop.key)
    } else {
        propertyDecorator(() => ({
            configurable: true,
            enumerable: true,
            get() {
                return get((this as any)[$$native])
            },
            set(v) {
                return set((this as any)[$$native], v)
            },
        }))(prototype, prop.key)
    }
}
