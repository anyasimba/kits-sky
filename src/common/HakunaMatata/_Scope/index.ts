import * as _ from './@'
globalify(_)

declare global {
    type Scope = _.Scope
    const withScope: typeof _.withScope
    const withHakunaMatata: typeof _.withHakunaMatata
}
