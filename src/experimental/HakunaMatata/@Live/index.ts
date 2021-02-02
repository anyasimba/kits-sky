import * as _ from './Live'
globalify(_)

declare global {
    type Live = _.Live
    const Live: typeof _.Live
}
