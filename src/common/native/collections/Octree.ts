declare global {
    type Octree = _.Octree
    const Octree: typeof _.Octree
}

namespace _ {
    @native.class('Octree')
    export class Octree extends Native {}
}
globalify(_)
export {}
