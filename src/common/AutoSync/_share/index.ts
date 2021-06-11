import * as _ from './_'
globalify(_)

declare global {
    type share = _.share
    const share: typeof _.share
}
