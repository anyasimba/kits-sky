export type link = typeof link
export function link(prototype: any, key: string) {
    let descriptor = Object.getOwnPropertyDescriptor(prototype, key)!
    if (descriptor == null) {
        descriptor = {}
    }
    if (descriptor.get == null) {
        const $$key = Symbol(key)
        descriptor.get = function (this: any) {
            return this[$$key]
        }
        descriptor.set = function (this: any, value: any) {
            if (!(value instanceof HakunaMatata)) {
                throw new Error('not instance of HakunaMatata')
            }
            if (this[$$key]) {
                this.remove(this[$$key])
            }
            if (value) {
                ;(value as any).__attachTo(this, () => (this[$$key] = null))
                this.__childs.push(value)
            }
            this[$$key] = value
        }
    } else {
        const get = descriptor.get!
        const set = descriptor.set!
        descriptor.get = function (this: any) {
            return get.call(this)
        }
        descriptor.set = function (this: any, value: any) {
            if (!(value instanceof HakunaMatata)) {
                throw new Error('not instance of HakunaMatata')
            }
            if (get.call(this)) {
                this.remove(get.call(this))
            }
            if (value) {
                ;(value as any).__attachTo(this, () => set.call(this, null))
                this.__childs.push(value)
            }
            set.call(this, value)
        }
    }
    Object.defineProperty(prototype, key, descriptor)
}
