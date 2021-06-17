import 'sky/common/Update'
import 'sky/common/native'

// root
let root = withScope(() => {})(() => {})()!
function resetRoot() {
    root.destroy()
    root = withScope(() => {})(() => {})()!
}

// systems
const physSystem = root.addLink(new Phys2System())

// entities
const circle = new Phys2Circle()
circle.radius = 19
const circleBody = new Phys2Body(circle, 1)
circleBody.position = new vec2({ x: 100, y: 100 })
circleBody.velocity = new vec2({ x: 100, y: 0 })
physSystem.add(circleBody)

const circle2 = new Phys2Circle()
circle2.radius = 19
const circleBody2 = new Phys2Body(circle2, 1)
circleBody2.position = new vec2({ x: 200, y: 100 })
physSystem.add(circleBody2)

// update
root.addLink(
    new IntervalWithDt(dt => {
        physSystem.update(dt)

        console.log(circleBody.position.x)

        if (_.isNaN(circleBody.position.x)) {
            resetRoot()
        }

        commit()
    }, 200)
)

commit()
