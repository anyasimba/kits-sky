@circle_of_life
export class Timeout extends CircleOfLife {
    timeout

    constructor(timeout: number, fn: () => void) {
        super()

        this.timeout = setTimeout(() => {
            fn()
            this.detach()
        }, timeout * 1000)
    }

    destructor() {
        clearTimeout(this.timeout)
    }
}

@circle_of_life
export class Interval extends CircleOfLife {
    interval

    constructor(interval: number, fn: () => void) {
        super()

        this.interval = setInterval(() => {
            fn()
            this.detach()
        }, interval * 1000)
    }

    destructor() {
        clearInterval(this.interval)
    }
}

@circle_of_life
export class AnimationFrame extends CircleOfLife {
    animationFrame: number

    constructor(fn: () => void) {
        super()

        this.animationFrame = requestAnimationFrame(() => {
            fn()
            this.detach()
        })
    }

    destructor() {
        cancelAnimationFrame(this.animationFrame)
    }
}

@circle_of_life
export class EventHandler extends CircleOfLife {
    source: EventTarget
    event: string
    fn: EventListenerOrEventListenerObject

    constructor(source: EventTarget, event: string, fn: EventListenerOrEventListenerObject) {
        super()

        this.source = source
        this.event = event
        this.fn = fn

        source.addEventListener(event, fn)
    }
    destructor() {
        const { source, event, fn } = this

        source.removeEventListener(event, fn)
    }
}
