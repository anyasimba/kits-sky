import { relationRef } from './_relationRef'

export type relation = typeof relation
export function relation<T>(set: (subject: T) => void) {
    return function (prorotype: any, key: string) {
        const $$key = Symbol(key)

        Object.defineProperty(prorotype, key, {
            get() {
                return this[$$key]
            },
            set(newSubject: T | null | undefined) {
                if (this[$$key] != null) {
                    const list = (this as any).__relations
                    for (let i = 0; i < list.length; i++) {
                        const [child, relation] = list[i]
                        if (child === this[$$key]) {
                            relation()
                            break
                        }
                    }
                    removeSubject.call(this, this[$$key])
                }
                if (newSubject != null) {
                    setSubject.call(this, $$key, newSubject)
                }
                this[$$key] = newSubject
            },
        })
    }

    function removeThisFrom(this: HakunaMatata, subject: HakunaMatata) {
        const list = (subject as any).__relationsLinks
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
            const [child, relation] = list[i]
            if (child === subject) {
                list.splice(i, 1)
                break
            }
        }
    }

    function setSubject(this: HakunaMatata, $$key: symbol, newSubject: any) {
        relationRef.subject = newSubject
        relationRef.self = this
        set.call(this, newSubject)
        const relations = relationRef.relations
        relationRef.subject = null
        relationRef.self = null
        relationRef.relations = []

        if (newSubject instanceof HakunaMatata) {
            ;(newSubject as any).__relationsLinks.push([
                this,
                () => {
                    ;(this as any)[$$key] = null
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
