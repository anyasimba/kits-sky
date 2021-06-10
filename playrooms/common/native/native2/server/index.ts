import 'sky/common/Update'
import 'sky/common/native'

// root
const root = withScope(() => {})(() => {})()!

// systems
const physSystem = root.add(new Phys2System())

// entities
const circle = new Phys2Circle()
circle.radius = 19
const circleBody = new Phys2Body(circle, 1)
circleBody.position = new vec2({ x: 100, y: 100 })
circleBody.velocity = new vec2({ x: 100, y: 0 })
physSystem.addBody(circleBody)

const circle2 = new Phys2Circle()
circle2.radius = 19
const circleBody2 = new Phys2Body(circle2, 1)
circleBody2.position = new vec2({ x: 200, y: 101 })
physSystem.addBody(circleBody2)

// update
root.add(
    new IntervalWithDt(dt => {
        physSystem.update(dt)

        commit()

        console.log(circleBody.position.x)
    }, 1000)
)

commit()
