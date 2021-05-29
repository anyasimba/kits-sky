import 'sky/common/native'

const div1 = makeDiv()
document.body.appendChild(div1)
const div2 = makeDiv()
document.body.appendChild(div2)

const root = withScope(() => {})(() => {})()!
const physSystem = root.add(new Phys2System())

const circle = new Phys2Circle()
circle.radius = 19
const circleBody = new Phys2Body(circle, 1)
circleBody.position = new vec2({ x: 100, y: 100 })
circleBody.velocity = new vec2({ x: 100, y: 0 })
physSystem.addBody(circleBody)

const circle2 = new Phys2Circle()
circle2.radius = 19
const circleBody2 = new Phys2Body(circle2, 1)
circleBody2.position = new vec2({ x: 200, y: 100 })
physSystem.addBody(circleBody2)

const animationFrames = root.add(
    new AnimationFrames(() => {
        physSystem.update(1 / 60)

        commit()

        div1.style.left = `${circleBody.position.x - 9.5}px`
        div1.style.top = `${circleBody.position.y - 9.5}px`

        div2.style.left = `${circleBody2.position.x - 9.5}px`
        div2.style.top = `${circleBody2.position.y - 9.5}px`
    })
)

commit()

function makeDiv() {
    const div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.background = 'red'
    div.style.borderRadius = '9.5px'
    div.style.width = '19px'
    div.style.height = '19px'
    return div
}
