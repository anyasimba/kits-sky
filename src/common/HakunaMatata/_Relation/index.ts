import * as _ from './@'
globalify(_)

declare global {
    const asRelation: typeof _.asRelation
    type Relation = _.Relation
    function useRelation<T>(
        initialValue: T | null | undefined | ((subject: T) => void),
        set?: (subject: T) => void
    ): [() => T | null, (newValue: T | null) => void]
}
