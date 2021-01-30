import 'sky/common/math'

namespace Global {
    @native_class('Phys2System')
    export class Phys2System extends Native {
        @native_prop('Array<Phys2Body*>') private bodies: NativeArray<Phys2Body>
        @native_prop('Array<PolygonComponent*>') private staticBodies: NativeArray<Phys2Body>
        @native_prop('Array<Phys2Force*>') forces: NativeArray<Phys2Force>
        @native_prop('size_t') totalIterations: number = 1
        @native_prop('size_t') collisionIterations: number = 10
        @native_prop('vec2') gravity: vec2 = new vec2({x: 0, y: 0})

        add (body: Phys2Body) {
            if (body.m === 0) {
                this.staticBodies.add(body)
            } else {
                this.bodies.add(body)
            }
            this.__onAdd(body)
        }

        remove (body: Phys2Body) {
            if (body.m === 0) {
                this.staticBodies.remove(body)
            } else {
                this.bodies.remove(body)
            }
            this.__onRemove(body)
        }
        
        @native_method('void', 'float')
        update: (dt: number) => void

        @native_method('void', 'Phys2Body*')
        private __onAdd: (body: Phys2Body) => void

        @native_method('void', 'Phys2Body*')
        private __onRemove: (body: Phys2Body) => void
    }
}
globally(Global)

declare global {
    const Phys2System: typeof Global.Phys2System
    type Phys2System = Global.Phys2System
}
