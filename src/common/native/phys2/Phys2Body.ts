// import 'sky/common/math'

// namespace Global {
//     @native_class('Phys2Body')
//     export class Phys2Body extends Native {
//         @native_prop('Shape*') shape: any
//         @native_prop('Array<Phys2Force*>') forces: NativeArray<Phys2Force>
//         @native_prop('vec2') position: vec2
//         @native_prop('vec2') velocity: vec2
//         @native_prop('number') angularVelocity: number
//         @native_prop('number') torque: number
//         @native_prop('number') orient: number = 0
//         @native_prop('number') I: number = 1
//         @native_prop('number') iI: number = 1
//         @native_prop('number') m: number = 1
//         @native_prop('number') im: number = 1
//         @native_prop('number') staticFriction: number
//         @native_prop('number') dynamicFriction: number
//         @native_prop('number') restitution: number

//         constructor (shape: any, density: number) {
//             super()
            
//             this.shape = shape
//             this.init(density)
//             this.setOrient(0)
//         }

//         @native_method('void', 'number') init: (density: number) => void
//         @native_method('void', 'number') setOrient: (orient: number) => void
//     }
// }
// globalify(Global)

// declare global {
//     type Phys2Body = Global.Phys2Body
//     const Phys2Body: typeof Global.Phys2Body
// }
