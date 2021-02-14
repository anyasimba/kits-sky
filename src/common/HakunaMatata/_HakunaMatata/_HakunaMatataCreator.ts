import { currentRef } from '../_Self'
import { useRef } from '../_use'
import {
    __getHakunaMatataDestructors,
    HakunaMatata as HakunaMatataClass,
    __getHakunaMatataType,
} from './_HakunaMatataClass'
import { runtimeRef } from '../_runtimeRef'
import { SharedTypeID } from '../_Update/_SharedTypeID'
import { relationInitialsRef } from '../_Relation/_relationInitialsRef'
import { updateRef } from '../_Update/_updateRef'
import { Update } from '../_Update/_Update'
import { actionRef } from '../_Action/_actionRef'

Object.defineProperty(HakunaMatata, Symbol.hasInstance, {
    value: (obj: any) => {
        return __getHakunaMatataType(obj) === null
    },
})

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

        let hakunaMatata: IHakunaMatata
        if (actionRef.mode !== ActionMode.PURE && actionMode === ActionMode.PURE) {
            // eslint-disable-next-line no-console
            console.log('should in pure')
            return
        } else {
            const savedActionMode = updateRef.mode
            updateRef.mode = 'create'
            hakunaMatata = (constructor as any)(...args) as IHakunaMatata
            updateRef.mode = savedActionMode
        }

        const currentHakunaMatata = currentRef.stack.pop()
        const currentHakunaMatataInterface = currentHakunaMatata.getConstructor()
        currentHakunaMatataInterface[$$type] = null
        Object.setPrototypeOf(currentHakunaMatataInterface, currentHakunaMatata.parent)
        Object.setPrototypeOf(hakunaMatata, currentHakunaMatataInterface)

        useRef.effects.forEach(effect => {
            const destructor = effect()
            if (destructor) {
                __getHakunaMatataDestructors(hakunaMatata).push(destructor)
            }
        })
        useRef.effects = []

        relationInitialsRef.initials.forEach(initial => initial())
        relationInitialsRef.initials = []

        if (currentRef.stack.length === 0) {
            Update({
                deps: [],
                mode: ActionMode.TRANSPARENT,
                type: 'create',
                options: {
                    type: sharedTypeID,
                },
            })
        }

        return (hakunaMatata as any) as R
    }
    return create as (...args: P) => R
}
