import * as _ from './_'
globalify(_)

declare global {
    type share = _.share
    const share: typeof _.share

    type shared = _.shared
    const shared: typeof _.shared
}
