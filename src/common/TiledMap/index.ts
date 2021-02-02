import 'sky/common/math'
import * as _ from './TiledMap'
globalify(_)

declare global {
    type TiledMapPoint = _.TiledMapPoint
    type TiledMapPolygon = _.TiledMapPolygon

    type TiledMap = _.TiledMap
    const TiledMap: typeof _.TiledMap
}
