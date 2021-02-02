export const hakunaMatataRelationRef: { subject: any } = { subject: null }
enum RelationType {}
export type Relation = () => RelationType

export function useRelation<T>(
    initialValue: T,
    onSet: (subject: T) => void
): [() => T | null, (newValue: T | null) => void] {
    let value: T | null = initialValue
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
                onSet(newValue)
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
