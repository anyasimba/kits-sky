import { action } from './_action'
import { actionRef } from './_actionRef'

export function Pure(fn: () => void) {
    return (deps: []) => {
        if (actionRef.mode === ActionMode.PURE) {
            fn()
            return
        }
        // eslint-disable-next-line no-console
        console.log('fall in pure :)')
    }
}
