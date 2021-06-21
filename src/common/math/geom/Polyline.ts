import 'sky/common/shared'

declare global {
    type Polyline = _.Polyline
    const Polyline: typeof _.Polyline
}

namespace _ {
    @shared
    export class Polyline {
        constructor(public points: vec2[] = []) {}
    }
}

globalify(_)
