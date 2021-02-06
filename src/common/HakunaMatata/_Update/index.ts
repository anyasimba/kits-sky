import * as _ from './@'
globalify(_)

declare global {
    const accept: typeof _.accept
    const action: typeof _.action
    const ActionMode: typeof _.ActionMode
    type ActionMode = _.ActionMode
    const asAction: typeof _.asAction
    const asPure: typeof _.asPure
    const Dynamic: typeof _.Dynamic
    const routeUpdates: typeof _.routeUpdates
    type Update = _.Update
    const useShared: typeof _.useShared
}
