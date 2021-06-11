import * as _ from './_'
globalify(_)

declare global {
    const useScope: typeof _.useScope
}
