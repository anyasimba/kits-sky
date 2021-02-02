import { currentRef } from './_Self'
import { effectsRef } from './_hooks'
import { $$destructors, Effect as EffectClass } from './_Effect'

declare const global
type EffectNotAFunction = { [k: string]: unknown } & ({ bind?: never } | { call?: never })
type EffectPropsType<T> = T extends (...args: infer P) => any ? P : never
type EffectReturnType<T> = T extends (...args: any[]) => infer R ? R : never
export function Effect<T extends (...args: any[]) => EffectNotAFunction>(
    constructor: T
): (...args: EffectPropsType<T>) => EffectReturnType<T> {
    if (currentRef.stack.length > 0) {
        return EffectClass() as any
    }

    const r1 = (...args: EffectPropsType<T>) => {
        const savedUseEffect = global.useEffect
        global.useEffect = useEffect
        const effect = constructor(...args) as EffectReturnType<T>

        const currentEffect = currentRef.stack.pop()
        const currentEffectInterface = currentEffect.getConstructor()
        Object.setPrototypeOf(currentEffectInterface, currentEffect.parent)
        Object.setPrototypeOf(effect, currentEffectInterface)
        global.useEffect = savedUseEffect

        effectsRef.effects.forEach(effect => {
            const destructor = effect()
            if (destructor) {
                effect[$$destructors].push(destructor)
            }
        })
        effectsRef.effects = []

        return effect
    }

    return r1 as any
}
