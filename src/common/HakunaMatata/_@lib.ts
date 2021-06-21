import { HakunaMatata } from './_HakunaMatata'

export class Timeout extends HakunaMatata {
    constructor(cb: (dt: number) => void, timeout: number) {
        super()

        const withDtCb = withDt(cb)

        this.use(detach => {
            const id = setTimeout(() => {
                withDtCb()
                detach()
            }, timeout)

            return () => clearTimeout(id)
        })
    }
}

export class Interval extends HakunaMatata {
    constructor(cb: (dt: number) => void, interval: number) {
        super()

        const withDtCb = withDt(cb)

        this.use(() => {
            const id = setInterval(withDtCb, interval)
            return () => clearInterval(id)
        })
    }
}

export class AnimationFrame extends HakunaMatata {
    constructor(cb: (dt: number) => void) {
        super()

        const withDtCb = withDt(cb)

        this.use(detach => {
            const id = requestAnimationFrame(() => {
                withDtCb()
                detach()
            })

            return () => cancelAnimationFrame(id)
        })
    }
}

export class AnimationFrames extends HakunaMatata {
    constructor(cb: (dt: number) => void) {
        super()

        const withDtCb = withDt(cb)

        this.use(() => {
            let id = requestAnimationFrame(frame)
            function frame() {
                id = requestAnimationFrame(frame)
                withDtCb()
            }
            return () => cancelAnimationFrame(id)
        })
    }
}
