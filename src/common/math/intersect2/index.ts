import * as _ from './intersect2'
globally(_, Math)

declare global {
    interface Intersect2 {
        isIntersect: boolean
        x?: number
        y?: number
    }

    interface Math {
        intersect2(p1: vec2, p2: vec2, p3: vec2, p4: vec2, limit: boolean): Intersect2
    }
}
