export function asRelation<T extends any[]>(
    relation: (...args: T) => () => void
): (...args: T) => Relation {
    return relation as any
}
