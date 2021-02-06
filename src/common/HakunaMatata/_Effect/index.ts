import * as _ from './@'
globalify(_)

declare global {
    const asEffect: typeof _.asEffect

    type IEffect = _.IEffect
    const Effect: typeof _.Effect & typeof _.EffectClass
}
