import { $$prototype, $$id } from './__'

let uniqObjectId = 0

export function newShared<
    T extends {
        new (...args: any[]): any
    }
>(classToCreate: T, ...args: ConstructorParameters<T>): InstanceType<T> {
    const obj: any = new classToCreate(...args)
    Object.setPrototypeOf(obj, classToCreate.prototype[$$prototype])
    obj[$$id] = ++uniqObjectId
    return obj
}
