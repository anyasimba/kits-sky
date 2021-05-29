import 'sky/common/math'

declare global {
    const Phys2Force: typeof _.Phys2Force
    type Phys2Force = _.Phys2Force
}

namespace _ {
    @native.class('Phys2Force')
    export class Phys2Force extends Native {
        @native.prop('vec2') force!: vec2
    }
}
globalify(_)
