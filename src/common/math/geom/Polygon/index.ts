import * as _ from './Polygon'
globalify(_)

declare global {
    type Polygon = _.Polygon
    const Polygon: typeof _.Polygon
}
