import { currentRef } from './_Self'
import { effectsRef } from './_hooks'
import { __getHakunaMatataDestructors, HakunaMatata as HakunaMatataClass } from './HakunaMatata'

declare const global
type SelfNotAFunction = { [k: string]: unknown } & ({ bind?: never } | { call?: never })
export type HakunaMatataPropsType<T> = T extends (...args: infer P) => SelfNotAFunction ? P : never
export type HakunaMatataReturnType<T> = T extends (...args: any[]) => infer R ? R : never
export function HakunaMatata<T extends (...args: any[]) => SelfNotAFunction>(
    constructor: T
): (...args: HakunaMatataPropsType<T>) => HakunaMatataReturnType<T> {
    if (currentRef.stack.length > 0) {
        return HakunaMatataClass() as any
    }

    return (...args: HakunaMatataPropsType<T>) => {
        const savedUseEffect = global.useEffect
        global.useEffect = useEffect
        const hakunaMatata: IHakunaMatata = (constructor(...args) as any) as IHakunaMatata

        const currentHakunaMatata = currentRef.stack.pop()
        const currentHakunaMatataInterface = currentHakunaMatata.getConstructor()
        Object.setPrototypeOf(currentHakunaMatataInterface, currentHakunaMatata.parent)
        Object.setPrototypeOf(hakunaMatata, currentHakunaMatataInterface)
        global.useEffect = savedUseEffect

        effectsRef.effects.forEach(effect => {
            const destructor = effect()
            if (destructor) {
                __getHakunaMatataDestructors(hakunaMatata).push(destructor)
            }
        })
        effectsRef.effects = []

        return (hakunaMatata as any) as HakunaMatataReturnType<T>
    }
}
