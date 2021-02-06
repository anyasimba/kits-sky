const $$events = Symbol('events')

export class EventEmitter {
    on(ev: string, fn: (...args: any) => void) {
        if (!this[$$events]) {
            this[$$events] = {}
        }
        if (!this[$$events][ev]) {
            this[$$events][ev] = []
        }

        this[$$events][ev].push(fn)

        return () => {
            this[$$events][ev] = this[$$events][ev].filter(eventFn => fn !== eventFn)
            if (this[$$events][ev].length === 0) {
                delete this[$$events][ev]
            }
            if (Object.keys(this[$$events]).length === 0) {
                delete this[$$events]
            }
        }
    }

    emit(ev: string, ...args: any[]) {
        const events = this[$$events] && this[$$events][ev]
        if (events) {
            events.forEach(fn => {
                fn.call(null, ...args)
            })
        }
    }
}

export function FunctionEventEmitter<T extends any[], R>(fn: (...args: T) => R) {
    Object.setPrototypeOf(fn, EventEmitter.prototype)
    return fn as ((...args: T) => R) & EventEmitter
}
