import * as _ from './@'
globalify(_)

declare global {
    const useScope: typeof _.useScope
}
