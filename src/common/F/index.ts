import * as _ from './@'
globalify(_)

declare global {
    const Self: typeof _.Self
    const F: typeof _.F
}
