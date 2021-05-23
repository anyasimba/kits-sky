import 'sky/common/math'

namespace Global {
    @native_class('Phys2Circle')
    export class Phys2Circle extends Native {
        @native_prop('number') radius: number
    }

    @native_class('Phys2Polygon')
    export class Phys2Polygon extends Native {
        constructor(vertices: vec2[]) {
            super()

            if (Math.polyOrient(vertices) < 0) {
                vertices = vertices.reverse()
            }

            this.setVertices(vertices)
        }

        @native_method('void', 'Array<vec2>') private setVertices: (vertices: vec2[]) => void
    }
}
globalify(Global)

declare global {
    type Phys2Circle = Global.Phys2Circle
    const Phys2Circle: typeof Global.Phys2Circle

    type Phys2Polygon = Global.Phys2Polygon
    const Phys2Polygon: typeof Global.Phys2Polygon
}
