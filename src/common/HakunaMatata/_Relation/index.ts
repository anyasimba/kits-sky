import * as _ from './_'
globalify(_)

declare global {
    type relation = _.relation
    const relation: typeof _.relation

    const asRelation: typeof _.asRelation

    type Relation = _.Relation
    const setRelation: typeof _.setRelation
}
