import 'sky/common/Update'
import 'sky/common/native'

// root
const root = withScope(() => {})(() => {})()!

// entities
const item: Native & { belongs: OctreeBelongs } = new Native() as any

const octree = new Octree<typeof item>()
item.belongs = octree.add(
    item,
    new AABB3({
        xb: 0,
        yb: 0,
        zb: 0,
        xe: 1000,
        ye: 1000,
        ze: 1000,
    })
)

const nodes: OctreeNode<typeof item>[] = []
for (let i = 0; i < 8; ++i) {
    nodes.push((octree as any).nodes.get(i))
}
console.log(
    nodes.map(node => ({
        size: node.size,
        idx: node.idx,
        nodes: [...Array(8)].map((v, i) => {
            const innerNode = node.nodes.get(i)
            return innerNode
                ? {
                    size: innerNode.size,
                    idx: innerNode.idx,
                  }
                : null
        }),
        objs: node.objs.items,
    }))
)

// update
root.addLink(
    new IntervalWithDt(dt => {
        commit()
    }, 1000)
)

commit()
