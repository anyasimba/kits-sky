export class vec2 {
    static null: vec2 = new vec2({ x: 0, y: 0 })

    x: number
    y: number
    constructor(v: { x: number; y: number }) {
        this.x = v.x
        this.y = v.y
    }

    negative() {
        return new vec2({ x: -this.x, y: -this.y })
    }

    add(v: vec2) {
        return new vec2({ x: this.x + v.x, y: this.y + v.y })
    }

    subtract(v: vec2) {
        return new vec2({ x: this.x - v.x, y: this.y - v.y })
    }

    multiply(f: number) {
        return new vec2({ x: this.x * f, y: this.y * f })
    }

    divide(f: number) {
        return new vec2({ x: this.x / f, y: this.y / f })
    }

    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    unit() {
        return this.divide(this.length)
    }

    dot(v: vec2) {
        return this.x * v.x + this.y * v.y
    }
}
