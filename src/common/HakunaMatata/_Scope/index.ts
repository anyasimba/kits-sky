import * as _ from './@'
globalify(_)

declare global {
    const withScope: typeof _.withScope
    const withHakunaMatata: typeof _.withHakunaMatata
}
