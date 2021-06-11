import 'sky/common/math'

declare global {
    const Phys2System: typeof _.Phys2System
    type Phys2System = _.Phys2System
}

namespace _ {
    @native.class('Phys2System')
    export class Phys2System extends Native {
        @native.prop('Array<Phys2Body*>') private bodies!: NativeArray<Phys2Body>
        @native.prop('Array<PolygonComponent*>') private staticBodies!: NativeArray<Phys2Body>
        @native.prop('Array<Phys2Force*>') forces!: NativeArray<Phys2Force>
        @native.prop('size_t') totalIterations: number = 1
        @native.prop('size_t') collisionIterations: number = 10
        @native.prop('vec2') gravity: vec2 = new vec2({ x: 0, y: 0 })

        @native.method('void', 'float') update!: (dt: number) => void
        @native.method('void', 'Phys2Body*') private __onAdd!: (body: Phys2Body) => void
        @native.method('void', 'Phys2Body*') private __onRemove!: (body: Phys2Body) => void

        add(body: Phys2Body) {
            if (body.m === 0) {
                this.staticBodies.add(body)
            } else {
                this.bodies.add(body)
            }
            this.__onAdd(body)
        }

        remove(body: Phys2Body) {
            if (body.m === 0) {
                this.staticBodies.remove(body)
            } else {
                this.bodies.remove(body)
            }
            this.__onRemove(body)
        }
    }
}
globalify(_)
