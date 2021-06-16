import 'sky/common/Update'
import 'sky/common/native'

// root
const root = withScope(() => {})(() => {})()!

// entities
const item: Native & { belongs: OctreeBelongs; x: number } = new Native() as any
item.x = 19

const octree = new Octree<typeof item>()
item.belongs = octree.add(
    item,
    new AABB3({
        xb: 0,
        yb: 0,
        zb: 0,
        xe: 56,
        ye: 24,
        ze: 1,
    })
)
const logOctree: any = toLog(octree)[0]
console.log(logOctree.nodes[0])

// // update
// root.addLink(
//     new IntervalWithDt(dt => {
//         commit()
//     }, 1000)
// )

// commit()
