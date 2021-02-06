import 'sky/common/EventEmitter'
import * as _ from './@'
globalify(_)

// eslint-disable-next-line no-console
console.log('No worries!')

declare global {
    type IEffect = _.IEffect
    const Effect: typeof _.Effect & typeof _.EffectClass
    type IHakunaMatata = _.IHakunaMatata
    const HakunaMatata: typeof _.HakunaMatata & typeof _.HakunaMatataClass
    const commit: typeof _.commit
    const asEffect: typeof _.asEffect
    const Self: typeof _.Self
    function useRelation<T>(
        initialValue: T | null | undefined | ((subject: T) => void),
        set?: (subject: T) => void
    ): [() => T | null, (newValue: T | null) => void]
    type Relation = _.Relation
    const asRelation: typeof _.asRelation
    function useEffect(cb: () => (...args: any[]) => void): void
    const useShared: typeof _.useShared
    const Dynamic: typeof _.Dynamic
    const asAction: typeof _.asAction
    type ActionMode = _.ActionMode
    const ActionMode: typeof _.ActionMode
    const accept: typeof _.accept
    type Update = _.Update
    const action: typeof _.action
    const routeUpdates: typeof _.routeUpdates
    const withScope: typeof _.withScope
    const withHakunaMatata: typeof _.withHakunaMatata
}
