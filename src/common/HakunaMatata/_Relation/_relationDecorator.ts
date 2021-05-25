import { relationRef } from './_relationRef'

export type relation = typeof relation
export function relation<T>(set: (subject: T) => void) {
    return function (prototype: any, key: string) {
        let descriptor = Object.getOwnPropertyDescriptor(prototype, key)!
        if (descriptor == null) {
            descriptor = {}
        }
        if (descriptor.get == null) {
            const $$key = Symbol(key)
            descriptor.get = function (this: any) {
                return this[$$key]
            }
            descriptor.set = function (this: any, newSubject: T | null | undefined) {
                if (this[$$key] != null) {
                    const list = (this as any).__relations
                    for (let i = 0; i < list.length; i++) {
                        const [parent, relation] = list[i]
                        if (parent === this[$$key]) {
                            relation()
                            break
                        }
                    }
                    removeSubject.call(this, this[$$key])
                }
                if (newSubject != null) {
                    setSubject.call(
                        this,
                        () => this[$$key],
                        (v: any) => (this[$$key] = v),
                        newSubject
                    )
                }
                this[$$key] = newSubject
            }
        } else {
            const get = descriptor.get!
            const set = descriptor.set!
            descriptor.get = function (this: any) {
                return get.call(this)
            }
            descriptor.set = function (this: any, newSubject: T | null | undefined) {
                if (get.call(this) != null) {
                    const list = (this as any).__relations
                    for (let i = 0; i < list.length; i++) {
                        const [parent, relation] = list[i]
                        if (parent === get.call(this)) {
                            relation()
                            break
                        }
                    }
                    removeSubject.call(this, get.call(this))
                }
                if (newSubject != null) {
                    setSubject.call(this, get.bind(this), set.bind(this), newSubject)
                }
                set.call(this, newSubject)
            }
        }
        Object.defineProperty(prototype, key, descriptor)
    }

    function removeThisFrom(this: HakunaMatata, subject: HakunaMatata) {
        const list = (subject as any).__relationsChilds
        for (let i = 0; i < list.length; i++) {
            const [child, relation] = list[i]
            if (child === this) {
                list.splice(i, 1)
                break
            }
        }
    }

    function removeSubject(this: HakunaMatata, subject: any) {
        const list = (this as any).__relations
        for (let i = 0; i < list.length; i++) {
            const [parent, relation] = list[i]
            if (parent === subject) {
                list.splice(i, 1)
                break
            }
        }
    }

    function setSubject(this: HakunaMatata, get_: any, set_: any, newSubject: any) {
        relationRef.subject = newSubject
        relationRef.self = this
        set.call(this, newSubject)
        const relations = relationRef.relations
        relationRef.subject = null
        relationRef.self = null
        relationRef.relations = []

        if (newSubject instanceof HakunaMatata) {
            ;(newSubject as any).__relationsChilds.push([
                this,
                () => {
                    set_(null)
                    removeSubject.call(this, newSubject)
                    relations!.forEach(relation => relation())
                },
            ])
            ;(this as any).__relations.push([
                newSubject,
                () => {
                    removeThisFrom.call(this, newSubject)
                    relations!.forEach(relation => relation())
                },
            ])
        } else {
            ;(this as any).__relations.push([
                newSubject,
                () => {
                    relations!.forEach(relation => relation())
                },
            ])
        }
    }
}
