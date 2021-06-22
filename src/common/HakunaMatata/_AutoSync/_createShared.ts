import { $$prototype, $$id } from './__'

let uniqObjectId = 0

export function createShared<
    T extends {
        new (...args: any[]): any
    }
>(classToCreate: T, ...args: ConstructorParameters<T>): InstanceType<T> {
    const obj: any = {}
    Object.setPrototypeOf(obj, classToCreate.prototype[$$prototype])
    obj[$$id] = ++uniqObjectId
    classToCreate.call(obj, ...args)
    return obj
}
