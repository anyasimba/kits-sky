import { runtimeRef } from '../_runtimeRef'
import { updateRef } from '../_Update/_updateRef'
import { actionRef } from './_actionRef'

export function action<T extends () => void>(fn: T) {
    runtimeRef.runtime = true

    if (actionRef.mode === ActionMode.PURE) {
        //
    } else if (actionRef.mode === ActionMode.CONTINUS) {
        //
    } else {
        fn()
        commit()
    }
}
