import 'sky/common/native'

const root = withScope(() => {})(() => {})()!
const physSystem = root.add(new Phys2System())

const circle = new Phys2Circle()
circle.radius = 19
const circle2 = new Phys2Circle()
circle2.radius = 19
const circleBody = new Phys2Body(circle, 1)
const circleBody2 = new Phys2Body(circle2, 1)
circleBody.position = new vec2({ x: 100, y: 100 })
circleBody2.position = new vec2({ x: 200, y: 100 })
circleBody.velocity = new vec2({ x: 100, y: 0 })
physSystem.addBody(circleBody)
physSystem.addBody(circleBody2)
commit()

setInterval(() => {
    physSystem.update(1 / 200)
    console.log(circleBody.position.x)
    console.log(physSystem.disposed, circle.disposed, circleBody.disposed)
}, 10)
