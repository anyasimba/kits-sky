import * as _ from './@'
globalify(_)

declare global {
    type Color = _.Color
    const Color: typeof _.Color
}
