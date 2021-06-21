import { propertyDecorator } from '@skyplay19/helpers'

export type link = typeof link
export const link = propertyDecorator(({ get, set }) => ({
    configurable: true,
    enumerable: true,
    get,
    set(value: any) {
        if (!(value instanceof HakunaMatata)) {
            throw new Error('not instance of HakunaMatata')
        }
        if (get.call(this)) {
            ;(this as any).removeLink(get.call(this))
        }
        if (value) {
            ;(value as any).__attachTo(this, () => set.call(this, null))
            ;(this as any).__childs.push(value)
        }
        set.call(this, value)
    },
}))
