import { isObj, isObjArray, isPrimitive, isPrimitiveArray, toType } from './_typeUtils'
import { $$autoSync, $$id, $$watchs, $$watchers } from './__'

export type watch = typeof watch
export function watch(type: string) {
    return function (prototype: any, key: string | symbol) {
        const constructor = prototype.constructor

        const watchMeta: any[] = (prototype.___watchMeta = prototype.___watchMeta || [])
        const types = toType(type)
        const typeMeta = {
            key,
            type: types,
        }
        watchMeta.push(typeMeta)

        const idx = watchMeta.length - 1
        const $$watchId = Symbol('watchId')

        let onSetValue: any
        if (isPrimitive(types[0])) {
            onSetValue = function (this: any, get: any, set: any, value: any) {
                this.__acceptSet(idx, value)
                if (this[$$watchers]) {
                    this[$$watchers].forEach((watcher: any) => {
                        watcher.__acceptSet(this[$$id], constructor[$$id], idx, value)
                    })
                }
            }
        } else if (isPrimitiveArray(types[0])) {
            onSetValue = function (this: any, get: any, set: any, value: any) {
                this.__acceptSet(idx, value)

                const current = get.call(this)

                if (current != null) {
                    current.constructor.___removeWatch(current, this, $$watchId)
                }

                if (value != null) {
                    value.constructor.___addWatch(value, this, $$watchId)
                }
            }
        } else if (isObjArray(types[0])) {
            const convertValue = (value: any) =>
                value == null ? null : value.map((obj: any) => obj[$$id])

            onSetValue = function (this: any, get: any, set: any, value: any) {
                this.__acceptSet(idx, convertValue(value))

                const current = get.call(this)
                if (current != null) {
                    current.constructor.___removeWatch(current, this, $$watchId)
                }

                if (value != null) {
                    value.constructor.___addWatch(value, this, $$watchId)
                }
            }
        } else if (isObj(types[0])) {
            const convertValue = (value: any) => (value == null ? null : value[$$id])

            onSetValue = function (this: any, get: any, set: any, value: any) {
                this.__acceptSet(idx, convertValue(value))

                const current = get.call(this)
                if (current != null) {
                    current.constructor.___removeWatch(current, this, $$watchId)
                }

                if (value != null) {
                    value.constructor.___addWatch(value, this, $$watchId)
                }
            }
        }

        return propertyDecorator(({ get, set }) => ({
            configurable: true,
            enumerable: true,
            get,
            set(this: any, value: any) {
                onSetValue?.call(this, get, set, value)
                set.call(this, value)
            },
        }))(prototype, key)
    }
}

watch.meta = function (constructor: any): { key: string; type: string[] }[] {
    return constructor.___watchMeta
}
