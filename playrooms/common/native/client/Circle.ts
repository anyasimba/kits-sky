export class Circle {
    div: HTMLDivElement
    body: Phys2Body

    constructor() {
        const div = (this.div = document.createElement('div'))
        div.style.position = 'absolute'
        div.style.background = 'red'
        div.style.borderRadius = '9.5px'
        div.style.width = '19px'
        div.style.height = '19px'
        document.body.appendChild(div)

        const circle = new Phys2Circle()
        circle.radius = 19 / 2
        this.body = new Phys2Body(circle, 1)
    }

    update() {
        this.div.style.left = `${this.body.position.x - 9.5}px`
        this.div.style.top = `${this.body.position.y - 9.5}px`
    }
}
