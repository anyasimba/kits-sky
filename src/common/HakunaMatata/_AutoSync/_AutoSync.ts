import { createShared } from './_createShared'

export class AutoSync {
    listener!: (key: string | symbol, value: any) => void

    new<
        T extends {
            new (...args: any[]): any
        }
    >(classToCreate: T, ...args: ConstructorParameters<T>): InstanceType<T> {
        return createShared(classToCreate, ...args)
    }

    accept(update: any) {
        console.log(update)
    }
}
