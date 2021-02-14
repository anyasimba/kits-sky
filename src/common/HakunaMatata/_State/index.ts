import * as _ from './@'
globalify(_)

declare global {
    type IState = _.IState
    const State: typeof _.State & typeof _.StateClass
}
