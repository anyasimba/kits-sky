import { HakunaMatata } from './_HakunaMatata'

export class Timeout extends HakunaMatata {
    constructor(cb: () => void, timeout: number) {
        super()

        this.use(detach => {
            const id = setTimeout(() => {
                cb()
                detach()
            }, timeout)

            return () => clearTimeout(id)
        })
    }
}

export class Interval extends HakunaMatata {
    constructor(cb: () => void, interval: number) {
        super()

        this.use(() => {
            const id = setInterval(cb, interval)
            return () => clearInterval(id)
        })
    }
}

export class AnimationFrame extends HakunaMatata {
    constructor(cb: () => void) {
        super()

        this.use(detach => {
            const id = requestAnimationFrame(() => {
                cb()
                detach()
            })

            return () => cancelAnimationFrame(id)
        })
    }
}

export class AnimationFrames extends HakunaMatata {
    constructor(cb: () => void) {
        super()

        this.use(() => {
            let id = requestAnimationFrame(frame)
            function frame() {
                id = requestAnimationFrame(frame)
                cb()
            }
            return () => cancelAnimationFrame(id)
        })
    }
}
