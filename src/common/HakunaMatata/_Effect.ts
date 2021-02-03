import { purgatoryRef } from './_purgatory'

const $$attachTo = Symbol('attachTo')
export const __attachEffectTo = (self: IEffect, ...args: any[]) => self[$$attachTo](...args)

const $$detachFrom = Symbol('detachFrom')
export const __detachEffectFrom = (self: IEffect, ...args: any[]) => self[$$detachFrom](...args)

const $$clear = Symbol('clear')
export const __clearEffect = (self: IEffect, ...args: any[]) => self[$$clear](...args)

const $$destructors = Symbol('destructors')
export const __getEffectDestructors = (self: IEffect) => self[$$destructors]

export type IEffect = {}
export const Effect = function () {
    const self = {}

    const links: IHakunaMatata[] = []
    const destructors: (() => void)[] = []

    const purgatory = purgatoryRef.effectsPurgatory
    purgatory.push(self)

    const __attachTo = (target: IHakunaMatata) => {
        if (links.length === 0) {
            const purgatory = purgatoryRef.effectsPurgatory
            purgatory.splice(purgatory.indexOf(self))
        }
        links.push(target)
    }

    const __detachFrom = (target: IHakunaMatata) => {
        links.splice(links.indexOf(target), 1)
        if (links.length === 0) {
            const purgatory = purgatoryRef.effectsPurgatory
            purgatory.push(self)
        }
    }

    const __clear = () => {
        destructors.forEach(destructor => destructor())
    }

    Object.setPrototypeOf(self, {
        [$$attachTo]: __attachTo,
        [$$detachFrom]: __detachFrom,
        [$$clear]: __clear,
    })

    return self
}
