import * as _ from './Color'
globally(_)

declare global {
    type Color = _.Color
    const Color: typeof _.Color
}
