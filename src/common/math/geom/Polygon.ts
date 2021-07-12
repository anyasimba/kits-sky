import 'sky/common/AutoSync/shared'

declare global {
    type Polygon = _.Polygon
    const Polygon: typeof _.Polygon
}

namespace _ {
    @shared('Polygon')
    export class Polygon {
        @share('vec2[]') points
        constructor(points: vec2[] = []) {
            this.points = points
        }
    }
}

globalify(_)
