export {}

declare global {
    interface Math {
        easeInOutQuad(t: number, b: number, c: number, d: number): number
    }
}

namespace _ {
    export function easeInOutQuad(t: number, b: number, c: number, d: number): number {
        t /= d / 2
        if (t < 1) {
            return (c / 2) * t * t + b
        }
        t--
        return (-c / 2) * (t * (t - 2) - 1) + b
    }
}

globalify(_, Math)
