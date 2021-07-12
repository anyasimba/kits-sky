import 'sky/common/AutoSync/shared'

declare global {
    type Polyline = _.Polyline
    const Polyline: typeof _.Polyline
}

namespace _ {
    @shared('Polyline')
    export class Polyline {
        @share('vec2[]') points
        constructor(points: vec2[] = []) {
            this.points = points
        }
    }
}

globalify(_)
