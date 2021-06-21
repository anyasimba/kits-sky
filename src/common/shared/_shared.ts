import { $$id, classMap, $$prototype, $$listener } from './__'

let uniqClassId = 0
let uniqObjectId = 0

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

shared.new = <
    T extends {
        new (...args: any[]): any
    }
>(
    classToCreate: T,
    listener: (key: string | symbol, value: any) => void,
    ...args: ConstructorParameters<T>
): InstanceType<T> => {
    const obj: any = {}
    Object.setPrototypeOf(obj, classToCreate.prototype[$$prototype])
    obj[$$id] = ++uniqObjectId
    classToCreate.call(obj, ...args)
    obj[$$listener] = listener
    return obj
}

shared.state = function <T>(obj: T): T {
    return obj
}
