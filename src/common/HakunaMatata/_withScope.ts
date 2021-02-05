import { HakunaMatataClass } from './@'

export const withScopeRef = { on: false }

export function withScope<T extends any[], R extends any>(
    fn: (scope: IHakunaMatata, ...args: T) => R
) {
    withScopeRef.on = true
    const scope = (HakunaMatataClass as any)({})
    withScopeRef.on = false

    return (...args: [...T, (scope: IHakunaMatata, ...args: T) => void]) => {
        const baseArgs = args.slice(0, -1) as T
        fn(scope, ...baseArgs)
        ;(_.last(args) as (scope: IHakunaMatata, ...args: T) => void)(scope, ...baseArgs)
        return () => (scope.dead ? null : scope)
    }
}
