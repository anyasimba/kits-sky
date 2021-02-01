import { currentHakunaMatataRef } from './_Self'
import { effectsRef } from './_hooks'
import { $$destructors, HakunaMatata as HakunaMatataClass } from './HakunaMatata'

declare const global
export type HakunaMatataPropsType<T> = T extends (...args: infer P) => any ? P : never
export type HakunaMatataReturnType<T> = T extends (...args: any[]) => infer R ? R : never
HakunaMatata.prototype = HakunaMatataClass.prototype
export function HakunaMatata<T extends (...args: any[]) => any>(
    constructor: T
): (...args: HakunaMatataPropsType<T>) => HakunaMatataReturnType<T> {
    if (currentHakunaMatataRef.stack.length > 0) {
        return HakunaMatataClass() as any
    }

    return (...args: HakunaMatataPropsType<T>) => {
        const savedUseEffect = global.useEffect
        global.useEffect = useEffect
        const hakunaMatata = constructor(...args)
        //
        const currentHakunaMatata = currentHakunaMatataRef.stack.pop()
        const currentHakunaMatataInterface = currentHakunaMatata.getConstructor()
        Object.setPrototypeOf(currentHakunaMatataInterface, currentHakunaMatata.parent)
        Object.setPrototypeOf(hakunaMatata, currentHakunaMatataInterface)
        global.useEffect = savedUseEffect

        effectsRef.value.forEach(effect => {
            const destructor = effect()
            if (destructor) {
                hakunaMatata[$$destructors].push(destructor)
            }
        })
        effectsRef.value = []

        return hakunaMatata
    }
}
