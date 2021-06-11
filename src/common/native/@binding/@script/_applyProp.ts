export function applyProp(name: string, prototype: any, prop: any) {
    const get = global.___NATIVE[`${name}_get_${prop.key}`]
    const set = global.___NATIVE[`${name}_set_${prop.key}`]
    if (prop.type.indexOf('*') !== -1) {
        Object.defineProperty(prototype, prop.key, {
            get() {
                return wraps[get(this[$$native])]
            },
            set(value) {
                const currentPointer = pointer(get(this[$$native]))
                if (currentPointer !== 0) {
                    this.remove(wraps[currentPointer])
                }
                if (value) {
                    ;(value as any).__attachTo(this, () => set(this[$$native], null))
                    this.__childs.push(value)
                    set(this[$$native], value[$$native])
                } else {
                    set(this[$$native], null)
                }
            },
        })
    } else {
        Object.defineProperty(prototype, prop.key, {
            get: function () {
                return get(this[$$native])
            },
            set: function (v) {
                return set(this[$$native], v)
            },
            enumerable: true,
            configurable: true,
        })
    }
}
