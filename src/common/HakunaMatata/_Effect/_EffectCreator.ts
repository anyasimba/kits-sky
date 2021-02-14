import { currentRef } from '../_Self'
import { useRef } from '../_use'
import { __getEffectDestructors, Effect as EffectClass, __getEffectType } from './_EffectClass'
import { runtimeRef } from '../_runtimeRef'
import { SharedTypeID } from '../_Update/_SharedTypeID'

Object.defineProperty(Effect, Symbol.hasInstance, {
    value: (obj: any) => {
        return __getEffectType(obj) === null
    },
})

type EffectNotAFunction = { [k: string]: unknown } & ({ bind?: never } | { call?: never })
export function Effect<P extends any[], R extends EffectNotAFunction>(
    constructor: (...args: P) => R
): (...args: P) => R {
    if (currentRef.stack.length > 0) {
        return (EffectClass as any)(constructor)
    }

    if (runtimeRef.runtime) {
        throw new Error('Effect class in runtime')
    }

    const sharedTypeID = SharedTypeID.new(create)

    const $$type = Symbol('type')

    Object.defineProperty(create, Symbol.hasInstance, { value: (obj: any) => obj[$$type] === null })
    function create(...args: P) {
        runtimeRef.runtime = true

        const effect = constructor(...args) as R

        const currentEffect = currentRef.stack.pop()
        const currentEffectInterface = currentEffect.getConstructor()
        currentEffectInterface[$$type] = null
        Object.setPrototypeOf(currentEffectInterface, currentEffect.parent)
        Object.setPrototypeOf(effect, currentEffectInterface)

        useRef.effects.forEach(effect_ => {
            const destructor = effect_()
            if (destructor) {
                __getEffectDestructors(effect).push(destructor)
            }
        })
        useRef.effects = []

        return effect
    }
    return create
}
