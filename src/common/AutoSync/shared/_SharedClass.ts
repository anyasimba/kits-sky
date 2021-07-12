import { $$id } from '../__'
import { newShared } from '../_newShared'

export class Shared {
    new<
        T extends {
            new (...args: any[]): any
        }
    >(this: any, classToCreate: T, ...args: ConstructorParameters<T>): InstanceType<T> {
        if (this[$$id] != null) {
            return newShared(classToCreate, ...args)
        }
        return new classToCreate(...args)
    }
}
