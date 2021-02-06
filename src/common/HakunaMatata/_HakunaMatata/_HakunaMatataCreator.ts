import { currentRef } from '../_Self'
import { effectsRef, useEffect } from '../_hooks'
import {
    __getHakunaMatataDestructors,
    HakunaMatata as HakunaMatataClass,
    __getHakunaMatataType,
} from './_HakunaMatataClass'
import { runtimeRef } from '../_runtime'
import { SharedTypeID } from '../_SharedTypeID'
import { relationInitialsRef } from '../_Relation'

Object.defineProperty(HakunaMatata, Symbol.hasInstance, {
    value: (obj: any) => {
        return __getHakunaMatataType(obj) === null
    },
})

declare const global
type HakunaMatataNotAFunction = { [k: string]: unknown } & ({ bind?: never } | { call?: never })
export function HakunaMatata<P extends any[], R extends HakunaMatataNotAFunction>(
    constructor: (...args: P) => R
): (...args: P) => R {
    if (currentRef.stack.length > 0) {
        return (HakunaMatataClass as any)(constructor)
    }

    if (runtimeRef.runtime) {
        throw new Error('HakunaMatata class in runtime')
    }

    const sharedTypeID = SharedTypeID.new(create)

    const $$type = Symbol('type')

    Object.defineProperty(create, Symbol.hasInstance, { value: (obj: any) => obj[$$type] === null })
    function create(...args: P) {
        runtimeRef.runtime = true

        const savedUseEffect = global.useEffect
        global.useEffect = useEffect
        const hakunaMatata = (constructor(...args) as any) as IHakunaMatata

        const currentHakunaMatata = currentRef.stack.pop()
        const currentHakunaMatataInterface = currentHakunaMatata.getConstructor()
        currentHakunaMatataInterface[$$type] = null
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

        relationInitialsRef.initials.forEach(initial => initial())
        relationInitialsRef.initials = []

        return (hakunaMatata as any) as R
    }
    return create
}
