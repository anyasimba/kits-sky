import * as _ from './@'
globalify(_)

declare global {
    const commit: typeof _.commit
}
