import * as _ from './_'
globalify(_)

declare global {
    const mobx: typeof _.mobx
}
