import { purgatoryRef } from '../_purgatoryRef'
import { IEffect, __attachEffectTo, __detachEffectFrom } from '../_Effect/_EffectClass'
import { RelationType } from '../_Relation/_Relation'
import { relationRef } from '../_Relation/_relationRef'
import { withScopeRef } from '../_Scope/_withScopeRef'

const $$type = Symbol('type')
export const __getHakunaMatataType = (self: IHakunaMatata) => self[$$type]

const $$remove = Symbol('remove')
const $$attachTo = Symbol('attachTo')
const $$detachFrom = Symbol('detachFrom')
const $$clear = Symbol('clear')
export const __clearHakunaMatata = (self: IHakunaMatata, ...args) => self[$$clear](...args)

const $$relations = Symbol('relations')
export const __getHakunaMatataRelations = (self: IHakunaMatata) => self[$$relations]

const $$relationsLinks = Symbol('relationsLinks')
export const __getHakunaMatataRelationsLinks = (self: IHakunaMatata) => self[$$relationsLinks]

const $$destructors = Symbol('destructors')
export const __getHakunaMatataDestructors = (self: IHakunaMatata) => self[$$destructors]

export type IHakunaMatata = {
    readonly disposed: boolean
    add<T extends IHakunaMatata>(hakunaMatata: T): T
    remove(hakunaMatata: IHakunaMatata): void
    addEffect<T extends IEffect>(effect: T): T
    removeEffect(effect: IEffect): void
    setRelation(relation: Relation): void
    setEffect(effect: IEffect): void
    destroy(...args: any): void
}
export const HakunaMatata = function () {
    // eslint-disable-next-line prefer-rest-params
    const self: IHakunaMatata = arguments[0]

    const hakunaMatatas: IHakunaMatata[] = []
    const effects: (IEffect | (() => void))[] = []

    const links: IHakunaMatata[] = []

    const relations: [IHakunaMatata, () => void][] = []
    const relationsLinks: [IHakunaMatata, () => void[]][] = []

    const destructors: ((...args: any[]) => void)[] = []
    let disposed

    if (!withScopeRef.on) {
        const purgatory = purgatoryRef.hakunaMatataPurgatory
        purgatory.push(self)
    }

    const add = (hakunaMatata: IHakunaMatata) => {
        hakunaMatata[$$attachTo](self)
        hakunaMatatas.push(hakunaMatata)
        return hakunaMatata
    }

    const remove = (hakunaMatata: IHakunaMatata) => {
        hakunaMatata[$$detachFrom](self)
        __remove(hakunaMatata)
    }

    const addEffect = (effect: IEffect) => {
        __attachEffectTo(effect, self)
        effects.push(effect)
        return effect
    }

    const removeEffect = (effect: IEffect) => {
        __detachEffectFrom(effect, self)
        effects.splice(effects.indexOf(effect), 1)
    }

    const setRelation = (relation: Relation) => {
        relationRef.relations.push(relation)
    }

    const setEffect = (effect: IEffect) => {
        self.addEffect(effect)
        relationRef.relations.push(() => (self.removeEffect(effect) as unknown) as RelationType)
    }

    const destroy = (...args: any[]) => {
        __detachFromAll()
        __clear(...args)
    }

    const __remove = hakunaMatata => hakunaMatatas.splice(hakunaMatatas.indexOf(hakunaMatata), 1)

    const __attachTo = (target: IHakunaMatata) => {
        if (links.length === 0) {
            const purgatory = purgatoryRef.hakunaMatataPurgatory
            purgatory.splice(purgatory.indexOf(self), 1)
        }
        links.push(target)
    }

    const __detachFrom = (target: IHakunaMatata) => {
        links.splice(links.indexOf(target), 1)
        if (links.length === 0) {
            const purgatory = purgatoryRef.hakunaMatataPurgatory
            purgatory.push(self)
        }
    }

    const __clear = (...args: any[]) => {
        disposed = true
        hakunaMatatas.forEach(hakunaMatata => hakunaMatata[$$detachFrom](self))
        // after
        relationsLinks.forEach(([hakunaMatata, relations]) => relations())
        effects.forEach(effect => __detachEffectFrom(effect, self))
        relations.forEach(([subject, relations]) => relations())
        destructors.forEach(destructor => destructor(...args))
    }

    const __detachFromAll = () => {
        links.forEach(link => !link.disposed && link[$$remove](self))
    }

    return {
        [$$type]: null,
        get disposed() {
            return disposed === true
        },
        add,
        remove,
        addEffect,
        removeEffect,
        setRelation,
        setEffect,
        destroy,
        [$$remove]: __remove,
        [$$attachTo]: __attachTo,
        [$$detachFrom]: __detachFrom,
        [$$clear]: __clear,
        [$$relations]: relations,
        [$$relationsLinks]: relationsLinks,
        [$$destructors]: destructors,
    } as IHakunaMatata
}
