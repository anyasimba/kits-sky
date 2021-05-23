import { HakunaMatata } from '../_HakunaMatata'
import { withScopeRef } from './_withScopeRef'

export function withScope<T extends any[], R extends any>(
    fn: (scope: HakunaMatata, ...args: T) => R
) {
    return (...args: [...T, (scope: HakunaMatata, ...args: T) => void | (() => void)]) => {
        withScopeRef.on = true
        const scope: HakunaMatata = new HakunaMatata()
        withScopeRef.on = false

        const getScope = FunctionEventEmitter(() => (scope.disposed ? null : scope))

        const baseArgs = args.slice(0, -1) as T
        fn(scope, ...baseArgs)
        getScope.emit('change')
        getScope.emit('create')
        const destructor = (_.last(args) as (
            scope: HakunaMatata,
            ...args: T
        ) => void | (() => void))(scope, ...baseArgs)

        if (destructor) {
            if (scope.disposed) {
                destructor()
            } else {
                ;(scope as any).__destructors.push(destructor)
            }
        }

        if (scope.disposed) {
            getScope.emit('change')
            getScope.emit('destroy')
        } else {
            ;(scope as any).__destructors.push(() => {
                getScope.emit('change')
                getScope.emit('destroy')
            })
        }

        return getScope
    }
}
