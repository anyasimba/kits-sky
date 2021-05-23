export const __$$prototype = Symbol('prototype')

export type share = typeof share
export function share(access: string): (prototype: any, key: string) => void
export function share(prototype: any, key: string): void
export function share(...args: any[]): any {
    if (typeof args[0] === 'string') {
        return (prototype: any, key: string) => decorate(args[0], prototype, key)
    }
    decorate(null, args[0], args[1])
}

function decorate(access: string | null, prototype: any, key: string) {
    if (prototype[__$$prototype] == null) {
        prototype[__$$prototype] = Object.setPrototypeOf({}, prototype)
    }
    const $prototype = prototype[__$$prototype]
    const $$key = Symbol(key)
    Object.defineProperty($prototype, key, {
        get: function () {
            return this[$$key]
        },
        set: function (v) {
            this[$$key] = v
        },
    })
    Object.defineProperty($prototype, `raw_${key}`, {
        get: function () {
            return this[$$key]
        },
        set: function (v) {
            this[$$key] = v
        },
    })
}
