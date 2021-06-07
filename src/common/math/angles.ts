declare global {
    interface Math {
        clampAngle(angle: number): number
    }
}

namespace _ {
    export function clampAngle(angle: number) {
        const { PI } = Math
        const PI2 = PI * 2
        angle = angle % PI2
        if (angle < -PI) {
            angle += PI2
        } else if (angle > PI) {
            angle -= PI2
        }
        return angle
    }
}

globalify(_, Math)
export {}
