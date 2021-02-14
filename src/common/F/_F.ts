import { selfRef } from './_Self'

type NotAFunction = { [k: string]: unknown } & ({ bind?: never } | { call?: never })
export function F<P extends any[], R extends NotAFunction>(
    constructor: (...args: P) => R
): (...args: P) => R {
    const $$type = Symbol('type')

    const create = (...args: P) => {
        if (selfRef.stack.length === 0) {
            selfRef.self = {}
        }
        const current: any = {}
        selfRef.stack.push(current)

        const { self } = selfRef
        constructor(...args)

        selfRef.stack.pop()
        if (selfRef.stack.length === 0) {
            selfRef.self = undefined
        }

        const currentInterface = current.getConstructor()
        currentInterface[$$type] = null
        if (current.parent) {
            Object.setPrototypeOf(currentInterface, Object.getPrototypeOf(self))
        }
        Object.setPrototypeOf(self, currentInterface)

        return self as R
    }

    Object.defineProperty(create, Symbol.hasInstance, {
        value: (obj: any) => obj[$$type] !== undefined,
    })

    return create
}
