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
export class TimeoutWithDt extends Timeout {
    constructor(cb: (dt: number) => void, timeout: number) {
        super(withDt(cb), timeout)
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
export class IntervalWithDt extends Interval {
    constructor(cb: (dt: number) => void, interval: number) {
        super(withDt(cb), interval)
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
export class AnimationFrameWithDt extends AnimationFrame {
    constructor(cb: (dt: number) => void) {
        super(withDt(cb))
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
export class AnimationFramesWithDt extends AnimationFrames {
    constructor(cb: (dt: number) => void) {
        super(withDt(cb))
    }
}
