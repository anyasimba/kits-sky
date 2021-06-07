declare global {
    type Polyline = _.Polyline
    const Polyline: typeof _.Polyline
}

namespace _ {
    export class Polyline {
        constructor(public points: vec2[] = []) {}
    }
}

globalify(_)
export {}
