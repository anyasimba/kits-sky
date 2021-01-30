import * as _ from './Polyline'
globally(_)

declare global {
    type Polyline = _.Polyline
    const Polyline: typeof _.Polyline
}
