import * as _ from './_'
globalify(_)

declare global {
    type TiledMapPoint = _.TiledMapPoint
    type TiledMapPolygon = _.TiledMapPolygon

    type TiledMap = _.TiledMap
    const TiledMap: typeof _.TiledMap
}
