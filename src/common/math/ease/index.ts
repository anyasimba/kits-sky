import * as _ from './ease'
globally(_, Math)

declare global {
    interface Math {
        easeInOutQuad(t: number, b: number, c: number, d: number): number
    }
}
