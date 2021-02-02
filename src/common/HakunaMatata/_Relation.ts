export const hakunaMatataRelationRef: { subject: any } = { subject: null }
enum RelationType {}
export type Relation = () => RelationType

export function useRelation<T>(
    initialValue: T,
    set?: (subject: T) => void
): [() => T | null, (newValue: T | null) => void] {
    let value: T | null
    if (arguments.length === 1) {
        set = initialValue as any
    } else {
        value = initialValue as T
    }

    return [
        () => {
            return value
        },
        newValue => {
            if (value) {
                // remove magic
            }
            if (newValue) {
                hakunaMatataRelationRef.subject = value
                set!(newValue)
                hakunaMatataRelationRef.subject = null
            }
            value = newValue
        },
    ]
}

export function asRelation<T extends any[]>(
    relation: (...args: T) => () => void
): (...args: T) => Relation {
    return relation as any
}
