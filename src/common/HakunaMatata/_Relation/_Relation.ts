import { relationRef } from './_relationRef'

export enum RelationType {}
export type Relation = () => RelationType

export function setRelation(relation: Relation) {
    relationRef.relations.push(relation)
}

export function setEffect(effect: Effect) {
    const self = relationRef.self!
    self.addEffect(effect)
    relationRef.relations.push((() => {
        if (!self.disposed && !effect.disposed) {
            self.removeEffect(effect)
        }
    }) as Relation)
}
