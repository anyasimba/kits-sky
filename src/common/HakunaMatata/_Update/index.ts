import * as _ from './@'
globalify(_)

declare global {
    const accept: typeof _.accept
    const Dynamic: typeof _.Dynamic
    const routeUpdates: typeof _.routeUpdates
    type Update = _.Update
    type Updater = _.Updater
    const Updater: typeof _.Updater
    const useShared: typeof _.useShared
    const Watch: typeof _.Watch
}
