import 'sky/common/native'

const div1 = makeDiv()
document.body.appendChild(div1)
const div2 = makeDiv()
document.body.appendChild(div2)

// root
const root = withScope(() => {})(() => {})()!

// systems
const physSystem = root.add(new Phys2System())

// entities
const circle = new Phys2Circle()
circle.radius = 9.5
const circleBody = new Phys2Body(circle, 1)
circleBody.position = new vec2({ x: 100, y: 100 })
circleBody.velocity = new vec2({ x: 100, y: 0 })
physSystem.addBody(circleBody)

const circle2 = new Phys2Circle()
circle2.radius = 9.5
const circleBody2 = new Phys2Body(circle2, 1)
circleBody2.position = new vec2({ x: 200, y: 110 })
physSystem.addBody(circleBody2)

// update
root.add(
    new AnimationFramesWithDt(dt => {
        physSystem.update(dt)

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
