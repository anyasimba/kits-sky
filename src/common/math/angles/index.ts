import * as _ from './angles'
globalify(_, Math)

declare global {
    interface Math {
        clampAngle(angle: number)
    }
}
