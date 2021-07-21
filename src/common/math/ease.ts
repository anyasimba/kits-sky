export {}

declare global {
    interface Math {
        easeInOutQuad(t: number, b: number, c: number, d: number): number
    }
}

namespace _ {
    /**
     * Ease функция (in, out quad)
     * @param {Number} t время, 0 - продолжительность
     * @param {Number} b начало
     * @param {Number} c длина
     * @param {Number} d duration, продолжительность
     * @returns {Number} Returns the value of x for the equation.
     */
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
