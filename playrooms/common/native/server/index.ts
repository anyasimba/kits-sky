import 'sky/common/native'

const root = withScope(() => {})(() => {})()!
const physSystem = root.add(new Phys2System())
const circle = new Phys2Circle()
circle.radius = 19
const circleBody = new Phys2Body(circle, 1)
physSystem.addBody(circleBody)
commit()
