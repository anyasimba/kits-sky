import * as _ from './angles'
globally(_, Math)

declare global {
    interface Math {
        clampAngle(angle: number)
    }
}
