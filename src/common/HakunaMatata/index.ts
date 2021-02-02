// TODO
// Взаимосвязи
// Экшены и синхронизация

import * as _ from './@'
globalify(_)

// eslint-disable-next-line no-console
console.log('No worries!')

declare global {
    type IHakunaMatata = _.IHakunaMatata
    const HakunaMatata: typeof _.HakunaMatata & typeof _.HakunaMatataClass
    const Effect: typeof _.Effect & typeof _.EffectClass
    type PureEffect = _.PureEffect
    const asEffect: typeof _.asEffect
    const Self: typeof _.Self

    function useRelation<T>(
        initialValue: T | ((subject: T) => void),
        set?: (subject: T) => void
    ): [() => T | null, (newValue: T | null) => void]

    type Relation = _.Relation
    const asRelation: typeof _.asRelation

    function useEffect(cb: () => (...args: any[]) => void): void
}
