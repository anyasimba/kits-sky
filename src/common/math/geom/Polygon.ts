export {}

declare global {
    type Polygon = _.Polygon
    const Polygon: typeof _.Polygon
}

namespace _ {
    export class Polygon {
        constructor(public points: vec2[] = []) {}
    }
}

globalify(_)
