import { $$id, classMap, $$prototype, $$listener } from '../__'

let uniqClassId = 0

export type shared = typeof shared
export function shared(constructor: any) {
    constructor[$$id] = ++uniqClassId
    classMap[uniqClassId] = constructor
    Object.defineProperty(constructor.prototype, $$id, {
        configurable: false,
        enumerable: false,
        writable: true,
    })
}

shared

shared.state = function <T>(obj: T): T {
    return obj
}
