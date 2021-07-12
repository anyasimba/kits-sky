import 'sky/common/AutoSync/shared'

@shared('vec3')
export class vec3 {
    static null: vec3 = new vec3({ x: 0, y: 0, z: 0 })

    @share('number') x: number
    @share('number') y: number
    @share('number') z: number
    constructor(v: { x: number; y: number; z: number }) {
        this.x = v.x
        this.y = v.y
        this.z = v.z
    }

    negative() {
        return new vec3({ x: -this.x, y: -this.y, z: -this.z })
    }

    add(v: vec3) {
        return new vec3({ x: this.x + v.x, y: this.y + v.y, z: this.z + v.z })
    }

    subtract(v: vec3) {
        return new vec3({ x: this.x - v.x, y: this.y - v.y, z: this.z - v.z })
    }

    multiply(f: number) {
        return new vec3({ x: this.x * f, y: this.y * f, z: this.z * f })
    }

    divide(f: number) {
        return new vec3({ x: this.x / f, y: this.y / f, z: this.z / f })
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }

    unit() {
        return this.divide(this.length())
    }

    dot(v: vec3) {
        return this.x * v.x + this.y * v.y + this.z * v.z
    }

    cross(v: vec3) {
        return new vec3({
            x: this.y * v.z - this.z * v.y,
            y: this.z * v.x - this.x * v.z,
            z: this.x * v.y - this.y * v.x,
        })
    }
}
