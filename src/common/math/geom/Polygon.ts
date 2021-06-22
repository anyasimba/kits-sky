import 'sky/common/HakunaMatata/_AutoSync/_shared'

declare global {
    type Polygon = _.Polygon
    const Polygon: typeof _.Polygon
}

namespace _ {
    @shared
    export class Polygon {
        constructor(public points: vec2[] = []) {}
    }
}

globalify(_)
