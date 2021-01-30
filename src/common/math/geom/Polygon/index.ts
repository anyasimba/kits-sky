import * as _ from './Polygon'
globally(_)

declare global {
    type Polygon = _.Polygon
    const Polygon: typeof _.Polygon
}
