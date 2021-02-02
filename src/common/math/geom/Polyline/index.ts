import * as _ from './Polyline'
globalify(_)

declare global {
    type Polyline = _.Polyline
    const Polyline: typeof _.Polyline
}
