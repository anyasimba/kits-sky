import { runtimeRef } from "../_runtimeRef"

export function action<T extends () => void>(fn: T) {
    runtimeRef.runtime = true

    if (updateRef.mode === 'pure') {
        //
    } else if (updateRef.mode === 'continius') {
        //
    } else {
        fn()
        commit()
    }
}
