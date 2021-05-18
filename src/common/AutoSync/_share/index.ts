import * as _ from './@'
globalify(_)

declare global {
    type share = _.share
    const share: typeof _.share
}
