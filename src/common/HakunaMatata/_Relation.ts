import {
    __getHakunaMatataRelations,
    __getHakunaMatataRelationsLinks,
} from './_HakunaMatata/_HakunaMatataClass'
import { currentRef } from './_Self'

export const relationInitialsRef: { initials: (() => void)[] } = { initials: [] }

export const relationRef: {
    subject: IHakunaMatata | null
    self: IHakunaMatata | null
    relations: Relation[]
} = {
    subject: null,
    self: null,
    relations: [],
}

export enum RelationType {}
export type Relation = () => RelationType

export function useRelation<T extends IHakunaMatata>(
    initialValue: T | null | undefined,
    set: (subject: T) => void
): [() => T | null | undefined, (newValue: T | null) => void] {
    const hakunaMatata = _.last(currentRef.stack).current
    let subject: T | null | undefined = null
    let relations: Relation[] | null = null
    if (arguments.length === 1) {
        set = initialValue as any
    } else {
        if (initialValue != null) {
            relationInitialsRef.initials.push(() => setSubject(initialValue))
            subject = initialValue as T
        }
    }

    function removeSubject(subject: IHakunaMatata) {
        const list = __getHakunaMatataRelations(hakunaMatata)
        for (let i = 0; i < list.length; i++) {
            const [child, relations] = list[i]
            if (child === subject) {
                list.splice(i, 1)
                break
            }
        }
    }

    function removeHakunaMatataFrom(subject: IHakunaMatata) {
        const list = __getHakunaMatataRelationsLinks(subject)
        for (let i = 0; i < list.length; i++) {
            const [child, relations] = list[i]
            if (child === hakunaMatata) {
                list.splice(i, 1)
                break
            }
        }
    }

    function setSubject(newSubject) {
        relations = relationRef.relations

        if (newSubject instanceof HakunaMatata) {
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
        } else {
            __getHakunaMatataRelations(hakunaMatata).push([
                newSubject,
                () => {
                    clear()
                },
            ])
        }

        relationRef.subject = newSubject
        relationRef.self = hakunaMatata
        set(newSubject)
        relationRef.subject = null
        relationRef.self = null
        relationRef.relations = []
    }

    const clear = () => {
        relations!.forEach(relation => relation())
    }

    return [
        () => {
            return subject
        },
        (newSubject: T | null | undefined) => {
            if (subject != null) {
                removeSubject(subject)
                clear()
            }
            if (newSubject != null) {
                setSubject(newSubject)
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
