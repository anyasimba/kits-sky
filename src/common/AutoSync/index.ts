import * as _ from './_'
globalify(_)

declare global {
    type AutoSync = typeof _.AutoSync
    const AutoSync: typeof _.AutoSync
}
