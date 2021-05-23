import * as _ from './@'
globalify(_)

declare global {
    const asEffect: typeof _.asEffect

    type Effect = _.Effect
    const Effect: typeof _.Effect
}
