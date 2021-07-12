import 'sky/common/AutoSync/shared'

declare global {
    type AABB2 = _.AABB2
    const AABB2: typeof _.AABB2

    type AABB3 = _.AABB3
    const AABB3: typeof _.AABB3
}

namespace _ {
    @shared('AABB2')
    export class AABB2 {
        @share('number') xb: number
        @share('number') yb: number
        @share('number') xe: number
        @share('number') ye: number
        constructor(v: { xb: number; yb: number; xe: number; ye: number }) {
            this.xb = v.xb
            this.yb = v.yb
            this.xe = v.xe
            this.ye = v.ye
        }
    }

    @shared('AABB3')
    export class AABB3 {
        @share('number') xb: number
        @share('number') yb: number
        @share('number') zb: number
        @share('number') xe: number
        @share('number') ye: number
        @share('number') ze: number
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
