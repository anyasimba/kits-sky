import 'sky/common/native'
import { Circle } from './Circle'

// root
const root = withScope(() => {})(() => {})()!

// systems
const physSystem = root.add(new Phys2System())

// entities
const circles: Circle[] = []
const circle = new Circle()
circle.body.position = new vec2({ x: 100, y: 100 })
circle.body.velocity = new vec2({ x: 100, y: 0 })
physSystem.addBody(circle.body)
circles.push(circle)

const circle2 = new Circle()
circle2.body.position = new vec2({ x: 200, y: 110 })
physSystem.addBody(circle2.body)
circles.push(circle2)

// update
root.add(
    new AnimationFramesWithDt(dt => {
        physSystem.update(dt)

        commit()

        circles.forEach(circle => circle.update())
    })
)

commit()
