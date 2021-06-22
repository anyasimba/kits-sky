import { $$listener, $$prototype } from './__'

export type share = typeof share
export function share(type: string): (prototype: any, key: string | symbol) => void {
    return function (prototype: any, key: string | symbol) {
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
        propertyDecorator(
            ({ get, set }) => ({
                configurable: true,
                enumerable: true,
                get,
                set(value: any) {
                    const listener = (this as any)[$$listener]
                    if (listener) {
                        listener(key, value)
                    }
                    set.call(this, value)
                },
            }),
            prototype
        )($prototype, key)
    }
}
