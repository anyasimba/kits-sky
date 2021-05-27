import 'sky/common/math'

namespace _ {
    @native.class('Phys2Body')
    export class Phys2Body extends Native {
        @native.prop('Shape*') shape: any
        @native.prop('Array<Phys2Force*>') forces!: NativeArray<Phys2Force>
        @native.prop('vec2') position!: vec2
        @native.prop('vec2') velocity!: vec2
        @native.prop('number') angularVelocity!: number
        @native.prop('number') torque!: number
        @native.prop('number') orient: number = 0
        @native.prop('number') I: number = 1
        @native.prop('number') iI: number = 1
        @native.prop('number') m: number = 1
        @native.prop('number') im: number = 1
        @native.prop('number') staticFriction!: number
        @native.prop('number') dynamicFriction!: number
        @native.prop('number') restitution!: number

        @native.method('void', 'number') init!: (density: number) => void
        @native.method('void', 'number') setOrient!: (orient: number) => void

        constructor(shape: any, density: number) {
            super()

            this.shape = shape

            this.init(density)
            this.setOrient(0)
        }
    }
}
globalify(_)

declare global {
    type Phys2Body = _.Phys2Body
    const Phys2Body: typeof _.Phys2Body
}
