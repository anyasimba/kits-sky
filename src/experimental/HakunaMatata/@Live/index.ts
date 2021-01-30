import * as _ from './Live'
globally(_)

declare global {
    type Live = _.Live
    const Live: typeof _.Live
}
