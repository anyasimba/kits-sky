import { purgatoryRef } from './_purgatory'
import { IEffect, $$links as $$effectLinks, $$detach as $$effectDetach } from './_Effect'

export const $$hakunaMatatas = Symbol('hakunaMatatas')
export const $$links = Symbol('links')
export const $$detach = Symbol('detach')
export const $$destructors = Symbol('destructor')
export const $$dead = Symbol('dead')

export type IHakunaMatata = {
    readonly dead
    add(hakunaMatata: IHakunaMatata): IHakunaMatata
    remove(hakunaMatata: IHakunaMatata)
    destroy()
}
export const HakunaMatata = function () {
    type HakunaMatata = {
        readonly dead
        add(hakunaMatata: HakunaMatata): HakunaMatata
        remove(hakunaMatata: HakunaMatata)
        addEffect(effect: IEffect | PureEffect)
        removeEffect(effect: IEffect | PureEffect)
        destroy()
    }
    const self: HakunaMatata = {} as any

    const hakunaMatatas: IHakunaMatata[] = []
    const effects: IEffect[] | (() => void) = []
    let links = 0
    const detach: [IHakunaMatata, () => void][] = []
    const destructors: (() => void)[] = []
    let dead

    const purgatory = purgatoryRef.hakunaMatataPurgatory
    purgatory.push(self)

    const add = (hakunaMatata: IHakunaMatata) => {
        const purgatory = purgatoryRef.hakunaMatataPurgatory
        if (hakunaMatata[$$links] === 0) {
            purgatory.splice(purgatory.indexOf(hakunaMatata))
        }
        ++hakunaMatata[$$links]
        hakunaMatata[$$detach].push([
            self,
            () => hakunaMatatas.splice(hakunaMatatas.indexOf(hakunaMatata)),
        ])
        hakunaMatatas.push(hakunaMatata)
        return hakunaMatata
    }

    const _remove = (hakunaMatata: IHakunaMatata) => {
        --hakunaMatata[$$links]
        const purgatory = purgatoryRef.hakunaMatataPurgatory
        if (hakunaMatata[$$links] === 0) {
            purgatory.push(hakunaMatata)
        } else {
            for (let i = 0; i < hakunaMatata[$$detach].length; ++i) {
                const detach = hakunaMatata[$$detach][i]
                if (detach[0] === self) {
                    hakunaMatata[$$detach].splice(i, 1)
                    break
                }
            }
        }
    }

    const remove = (hakunaMatata: IHakunaMatata) => {
        _remove(hakunaMatata)
        hakunaMatatas.splice(hakunaMatatas.indexOf(hakunaMatata))
    }

    const addEffect = (effect: IEffect | PureEffect) => {
        if (_.isFunction(effect)) {
            const destructor = effect()
            effects.push(destructor)
            return destructor
        }
        const purgatory = purgatoryRef.effectsPurgatory
        if (effect[$$effectLinks] === 0) {
            purgatory.splice(purgatory.indexOf(effect))
        }
        ++effect[$$effectLinks]
        effect[$$effectDetach].push([self, () => effects.splice(effects.indexOf(effect))])
        effects.push(effect)
        return effect
    }

    const _removeEffect = (effect: IEffect | (() => void)) => {
        if (_.isFunction(effect)) {
            effect()
            return
        }
        --effect[$$effectLinks]
        const purgatory = purgatoryRef.effectsPurgatory
        if (effect[$$effectLinks] === 0) {
            purgatory.push(effect)
        } else {
            for (let i = 0; i < effect[$$effectDetach].length; ++i) {
                const detach = effect[$$effectDetach][i]
                if (detach[0] === self) {
                    effect[$$effectDetach].splice(i, 1)
                    break
                }
            }
        }
    }

    const removeEffect = (effect: IEffect | (() => void)) => {
        if (_.isFunction(effect)) {
            effect()
            effects.splice(effects.indexOf(effect))
            return
        }
        _removeEffect(effect)
        effects.splice(effects.indexOf(effect))
    }

    const destroy = () => {
        dead = true
        detach.forEach(([hakunaMatata, fn]) => {
            if (!hakunaMatata.dead) {
                fn()
            }
        })
        hakunaMatatas.forEach(hakunaMatata => _remove(hakunaMatata))
        effects.forEach(effect => {
            _removeEffect(effect)
        })
        destructors.forEach(destructor => destructor())
    }

    Object.setPrototypeOf(self, {
        get dead() {
            return dead === true
        },
        set [$$dead](value) {
            dead = value
        },
        add,
        remove,
        addEffect,
        removeEffect,
        destroy,
        get [$$hakunaMatatas]() {
            return hakunaMatatas
        },
        get [$$links]() {
            return links
        },
        set [$$links](value: number) {
            links = value
        },
        get [$$detach]() {
            return detach
        },
        get [$$destructors]() {
            return destructors
        },
    })
    return self
}
