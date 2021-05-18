import * as _ from './@'
globalify(_, Math)

declare global {
    interface Math {
        clampAngle(angle: number): number
    }
}
