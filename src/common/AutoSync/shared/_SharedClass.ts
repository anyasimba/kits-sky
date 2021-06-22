import { $$id } from '../__'
import { createShared } from '../_createShared'

export class Shared {
    new<
        T extends {
            new (...args: any[]): any
        }
    >(classToCreate: T, ...args: ConstructorParameters<T>): InstanceType<T> {
        if ((this as any)[$$id] != null) {
            return createShared(classToCreate, ...args)
        }
        return new classToCreate(...args)
    }
}
