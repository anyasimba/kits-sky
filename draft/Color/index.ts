import * as _ from './Color'
globalify(_)

declare global {
    type Color = _.Color
    const Color: typeof _.Color
}
