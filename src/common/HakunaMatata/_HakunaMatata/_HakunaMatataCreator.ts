import { currentRef } from '../_Self'
import { effectsRef, useEffect } from '../_useEffect'
import {
    __getHakunaMatataDestructors,
    HakunaMatata as HakunaMatataClass,
    __getHakunaMatataType,
} from './_HakunaMatataClass'
import { runtimeRef } from '../_runtimeRef'
import { SharedTypeID } from '../_Update/_SharedTypeID'
import { relationInitialsRef } from '../_Relation/_relationInitialsRef'
import { updateRef } from '../_Update/_updateRef'

Object.defineProperty(HakunaMatata, Symbol.hasInstance, {
    value: (obj: any) => {
        return __getHakunaMatataType(obj) === null
    },
})

declare const global
type HakunaMatataNotAFunction = { [k: string]: unknown } & ({ bind?: never } | { call?: never })
export function HakunaMatata<P extends any[], R extends HakunaMatataNotAFunction>(
    actionMode: ActionMode | ((...args: P) => R),
    constructor?: (...args: P) => R
): (...args: P) => R {
    if (arguments.length === 1) {
        constructor = actionMode as any
        actionMode = ActionMode.TRANSPARENT
    }

    if (currentRef.stack.length > 0) {
        return (HakunaMatataClass as any)(constructor)
    }

    if (runtimeRef.runtime) {
        throw new Error('HakunaMatata class in runtime')
    }

    const sharedTypeID = SharedTypeID.new(create)

    const $$type = Symbol('type')

    Object.defineProperty(create, Symbol.hasInstance, {
        value: (obj: any) => obj[$$type] !== undefined,
    })
    function create(...args: P) {
        runtimeRef.runtime = true

        const savedUseEffect = global.useEffect
        global.useEffect = useEffect

        let hakunaMatata: IHakunaMatata
        if (actionMode === ActionMode.PURE) {
            const savedActionMode = updateRef.mode
            updateRef.mode = savedActionMode
            hakunaMatata = (constructor as any)(...args) as IHakunaMatata
            // update
            updateRef.mode = savedActionMode
        } else {
            hakunaMatata = (constructor as any)(...args) as IHakunaMatata
        }

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
