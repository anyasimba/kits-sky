import { __getHakunaMatataRelations, __getHakunaMatataRelationsLinks } from './HakunaMatata'
import { currentRef } from './_Self'

export const relationRef: {
    subject: IHakunaMatata | null
    self: IHakunaMatata | null
    relations: Relation[]
} = {
    subject: null,
    self: null,
    relations: [],
}

enum RelationType {}
export type Relation = () => RelationType

export function useRelation<T extends IHakunaMatata>(
    initialValue: T,
    set: (subject: T) => void
): [() => T | null, (newValue: T | null) => void] {
    const hakunaMatata = _.last(currentRef.stack)
    let subject: T | null
    let relations: Relation[] | null = null
    if (arguments.length === 1) {
        set = initialValue as any
    } else {
        subject = initialValue as T
    }

    const removeSubject = (subject: IHakunaMatata) => {
        const list = __getHakunaMatataRelations(hakunaMatata)
        for (let i = 0; i < list.length; i++) {
            const [child, relations] = list[i]
            if (child === subject) {
                list.splice(i)
                break
            }
        }
    }

    const removeHakunaMatataFrom = (subject: IHakunaMatata) => {
        const list = __getHakunaMatataRelationsLinks(subject)
        for (let i = 0; i < list.length; i++) {
            const [child, relations] = list[i]
            if (child === hakunaMatata) {
                list.splice(i)
                break
            }
        }
    }

    const clear = () => {
        relations!.forEach(relation => relation())
    }

    return [
        () => {
            return subject
        },
        (newSubject: T | null) => {
            if (subject) {
                removeSubject(subject)
                clear()
            }
            if (newSubject) {
                relations = relationRef.relations
                __getHakunaMatataRelationsLinks(newSubject).push([
                    hakunaMatata,
                    () => {
                        subject = null
                        removeSubject(newSubject)
                        clear()
                    },
                ])
                __getHakunaMatataRelations(hakunaMatata).push([
                    newSubject,
                    () => {
                        removeHakunaMatataFrom(newSubject)
                        clear()
                    },
                ])

                relationRef.subject = newSubject
                relationRef.self = hakunaMatata
                set(newSubject)
                relationRef.subject = null
                relationRef.self = null
                relationRef.relations = []
            } else {
                relations = null
            }
            subject = newSubject
        },
    ]
}

export function asRelation<T extends any[]>(
    relation: (...args: T) => () => void
): (...args: T) => Relation {
    return relation as any
}
