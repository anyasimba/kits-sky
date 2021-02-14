import * as _ from './@'
globalify(_)

declare global {
    const ActionMode: typeof _.ActionMode
    type ActionMode = _.ActionMode
    const asAction: typeof _.asAction
    const Pure: typeof _.Pure
    const Continius: typeof _.Continius
}
