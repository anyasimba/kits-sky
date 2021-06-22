import 'sky/common/HakunaMatata/_AutoSync/_shared'

declare global {
    type AABB2 = _.AABB2
    const AABB2: typeof _.AABB2

    type AABB3 = _.AABB3
    const AABB3: typeof _.AABB3
}

namespace _ {
    @shared
    export class AABB2 {
        xb: number
        yb: number
        xe: number
        ye: number
        constructor(v: { xb: number; yb: number; xe: number; ye: number }) {
            this.xb = v.xb
            this.yb = v.yb
            this.xe = v.xe
            this.ye = v.ye
        }
    }

    @shared
    export class AABB3 {
        xb: number
        yb: number
        zb: number
        xe: number
        ye: number
        ze: number
        constructor(v: { xb: number; yb: number; zb: number; xe: number; ye: number; ze: number }) {
            this.xb = v.xb
            this.yb = v.yb
            this.zb = v.zb
            this.xe = v.xe
            this.ye = v.ye
            this.ze = v.ze
        }
    }
}

globalify(_)
