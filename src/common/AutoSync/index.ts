import * as _ from './@'
globalify(_)

declare global {
    const Shared: typeof _.Shared
}
