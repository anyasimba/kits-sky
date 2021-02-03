import { purgatoryRef } from './_purgatory'
import { IEffect, __attachEffectTo, __detachEffectFrom } from './_Effect'
import { relationRef } from './_Relation'

const $$clear = Symbol('clear')
export const __clearHakunaMatata = (self: IHakunaMatata, ...args) => self[$$clear](...args)

const $$destructors = Symbol('destructors')
export const __getHakunaMatataDestructors = (self: IHakunaMatata) => self[$$destructors]

const $$relations = Symbol('relations')
export const __getHakunaMatataRelations = (self: IHakunaMatata) => self[$$relations]

const $$relationsLinks = Symbol('relationsLinks')
export const __getHakunaMatataRelationsLinks = (self: IHakunaMatata) => self[$$relationsLinks]

export type IHakunaMatata = {
    readonly dead: boolean
    add(hakunaMatata: IHakunaMatata): IHakunaMatata
    remove(hakunaMatata: IHakunaMatata): void
    addEffect<T extends IEffect | PureEffect>(effect: T): T
    removeEffect(effect: IEffect | PureEffect): void
    setRelation(relation: Relation): void
    destroy(...args: any): void
}
export const HakunaMatata = function () {
    const self: IHakunaMatata = {} as any

    const hakunaMatatas: IHakunaMatata[] = []
    const effects: (IEffect | (() => void))[] = []

    const links: IHakunaMatata[] = []

    const relations: [IHakunaMatata, () => void][] = []
    const relationsLinks: [IHakunaMatata, () => void[]][] = []

    const destructors: ((...args: any[]) => void)[] = []
    let dead

    const purgatory = purgatoryRef.hakunaMatataPurgatory
    purgatory.push(self)

    const add = (hakunaMatata: IHakunaMatata) => {
        hakunaMatata[$$attachTo](self)
        hakunaMatatas.push(self)
        return hakunaMatata
    }

    const remove = (hakunaMatata: IHakunaMatata) => {
        hakunaMatata[$$detachFrom](self)
        __remove(hakunaMatata)
    }

    const addEffect = (effect: IEffect | PureEffect) => {
        if (!_.isFunction(effect)) {
            __attachEffectTo(effect, self)
        }
        effects.push(effect)
        return effect
    }

    const removeEffect = (effect: IEffect | (() => void)) => {
        if (_.isFunction(effect)) {
            effect()
        } else {
            __detachEffectFrom(effect, self)
        }
        effects.splice(effects.indexOf(effect))
    }

    const setRelation = (relation: Relation) => {
        relationRef.relations.push(relation)
    }

    const destroy = (...args: any[]) => {
        __detachFromAll()
        __clear(...args)
    }

    const $$remove = Symbol('remove')
    const __remove = hakunaMatata => hakunaMatatas.splice(hakunaMatatas.indexOf(hakunaMatata))

    const $$attachTo = Symbol('attachTo')
    const __attachTo = (target: IHakunaMatata) => {
        if (links.length === 0) {
            const purgatory = purgatoryRef.hakunaMatataPurgatory
            purgatory.splice(purgatory.indexOf(self))
        }
        links.push(target)
    }

    const $$detachFrom = Symbol('detachFrom')
    const __detachFrom = (target: IHakunaMatata) => {
        links.splice(links.indexOf(target), 1)
        if (links.length === 0) {
            const purgatory = purgatoryRef.hakunaMatataPurgatory
            purgatory.push(self)
        }
    }

    const __clear = (...args: any[]) => {
        dead = true
        relationsLinks.forEach(([hakunaMatata, relations]) => relations())
        hakunaMatatas.forEach(child => child[$$detachFrom](self))
        effects.forEach(child => __detachEffectFrom(child, self))
        relations.forEach(([subject, relations]) => relations())
        destructors.forEach(destructor => destructor(...args))
    }

    const __detachFromAll = () => {
        links.forEach(link => !link.dead && link[$$remove](self))
    }

    Object.setPrototypeOf(self, {
        get dead() {
            return dead === true
        },
        add,
        remove,
        addEffect,
        removeEffect,
        setRelation,
        destroy,
        [$$remove]: __remove,
        [$$attachTo]: __attachTo,
        [$$detachFrom]: __detachFrom,
        [$$clear]: __clear,
        [$$relations]: relations,
        [$$relationsLinks]: relationsLinks,
    } as IHakunaMatata)
    return self
}
