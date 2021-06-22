export {}

declare global {
    type OctreeBelongs = _.OctreeBelongs

    type OctreeNode<T> = _.OctreeNode<T>
    const OctreeNode: typeof _.OctreeNode

    type Octree<T = Native> = _.Octree<T>
    const Octree: typeof _.Octree
}

namespace _ {
    export interface OctreeBelongs {
        nodes: Native[]
    }

    @native.class('OctreeNode')
    export abstract class OctreeNode<T> extends Native {
        @native.prop('OctreeNode*[8]') nodes!: StaticNativeArrayOfNative<OctreeNode<T>>
        @native.prop('number') size!: number
        @native.prop('number') idx!: number
        @native.prop('Array<Native*>') objs!: NativeArray<T>
    }

    @native.class('Octree')
    export class Octree<T = Native> extends Native {
        @native.prop('OctreeNode*[8]') private nodes!: NativeArray<OctreeNode<T>>

        @native.method('OctreeBelongs', 'Native*', 'AABB3')
        add!: (obj: Native, aabb: AABB3) => OctreeBelongs

        @native.method('Array<Native*>', 'AABB3')
        get!: (aabb: AABB3) => NativeArray<T>

        @native.method('void', 'Native*', 'OctreeBelongs')
        remove!: (obj: Native, belongs: OctreeBelongs) => void

        @native.method('OctreeBelongs', 'Native*', 'OctreeBelongs', 'AABB3')
        update!: (obj: Native, belongs: OctreeBelongs, aabb: AABB3) => OctreeBelongs
    }
}

globalify(_)
