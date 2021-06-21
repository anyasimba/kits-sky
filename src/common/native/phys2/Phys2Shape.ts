import 'sky/common/shared'
import 'sky/common/math'

declare global {
    type Phys2Circle = _.Phys2Circle
    const Phys2Circle: typeof _.Phys2Circle

    type Phys2Polygon = _.Phys2Polygon
    const Phys2Polygon: typeof _.Phys2Polygon
}

namespace _ {
    @shared
    @native.class('Phys2Circle')
    export class Phys2Circle extends Native {
        @native.prop('number') radius!: number
    }

    @shared
    @native.class('Phys2Polygon')
    export class Phys2Polygon extends Native {
        @native.method('void', 'Array<vec2>') private setVertices!: (vertices: vec2[]) => void

        constructor(vertices: vec2[]) {
            super()

            if (Math.polyOrient(vertices) < 0) {
                vertices = vertices.reverse()
            }

            this.setVertices(vertices)
        }
    }
}
globalify(_)
