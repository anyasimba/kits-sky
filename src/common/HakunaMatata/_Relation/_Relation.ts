import { relationRef } from './_relationRef'

export enum RelationType {}
export type Relation = () => RelationType

export function setRelation(relation: Relation) {
    relationRef.relations.push(relation)
}
