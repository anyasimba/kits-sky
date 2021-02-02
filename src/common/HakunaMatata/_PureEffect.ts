enum PureEffectType {}
export type PureEffect = () => PureEffectType
export function asEffect<T extends any[]>(
    effect: (...args: T) => () => void
): (...args: T) => PureEffect {
    return effect as any
}
