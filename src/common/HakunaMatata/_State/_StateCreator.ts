import { currentRef } from '../_Self'
import { State as StateClass, __getStateType } from './_StateClass'
import { runtimeRef } from '../_runtimeRef'
import { SharedTypeID } from '../_Update/_SharedTypeID'

Object.defineProperty(Effect, Symbol.hasInstance, {
    value: (obj: any) => {
        return __getStateType(obj) === null
    },
})

type StateNotAFunction = { [k: string]: unknown } & ({ bind?: never } | { call?: never })
export function State<P extends any[], R extends StateNotAFunction>(
    constructor: (...args: P) => R
): (...args: P) => R {
    if (currentRef.stack.length > 0) {
        return (StateClass as any)(constructor)
    }

    if (runtimeRef.runtime) {
        throw new Error('State class in runtime')
    }

    const sharedTypeID = SharedTypeID.new(create)

    const $$type = Symbol('type')

    Object.defineProperty(create, Symbol.hasInstance, { value: (obj: any) => obj[$$type] === null })
    function create(...args: P) {
        runtimeRef.runtime = true

        const state = constructor(...args) as R

        const currentState = currentRef.stack.pop()
        const currentStateInterface = currentState.getConstructor()
        currentStateInterface[$$type] = null
        Object.setPrototypeOf(currentStateInterface, currentState.parent)
        Object.setPrototypeOf(state, currentStateInterface)

        return state
    }
    return create
}
