import { $$id } from '../__'
import { toType } from '../_typeUtils'
import { $$watchers, $$prototype } from './__'
import { newShared } from '../_newShared'

export type share = typeof share
export function share(type: string): (prototype: any, key: string | symbol) => void {
    return function (prototype: any, key: string | symbol) {
        if (prototype instanceof Watcher) {
            console.log('SHARED IN WATCHER', type, key)
        }
        const constructor = prototype.constructor

        if (!Object.hasOwnProperty.call(prototype, $$prototype)) {
            let $prototype = Object.setPrototypeOf({}, prototype)
            if (prototype[$$prototype]) {
                $prototype = Object.create(
                    prototype,
                    Object.getOwnPropertyDescriptors(prototype[$$prototype])
                )
            }
            prototype[$$prototype] = $prototype
        }
        const $prototype = prototype[$$prototype]

        const sharedMeta: any[] = (prototype.___sharedMeta = prototype.___sharedMeta || [])
        const types = toType(type)
        const typeMeta = {
            key,
            type: types,
        }
        sharedMeta.push(typeMeta)
        const idx = sharedMeta.length - 1

        propertyDecorator(
            ({ get, set }) => ({
                configurable: true,
                enumerable: true,
                get,
                set(this: any, value: any) {
                    this[$$watchers]?.forEach((watcher: any) => {
                        watcher.__acceptSet(this[$$id], constructor[$$id], idx, value)
                    })
                    set.call(this, value)
                },
            }),
            prototype
        )($prototype, key)
    }
}

share.new = function <
    T extends {
        new (...args: any[]): any
    }
>(classToCreate: T, ...args: ConstructorParameters<T>): InstanceType<T> {
    return newShared(classToCreate, ...args)
}
