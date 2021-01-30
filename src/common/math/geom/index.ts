import './AABB'
import './Polygon'
import './Polyline'
import * as _ from './geom'
globally(_, Math)

declare global {
    interface Math {
        distance2(p1: vec2, p2: vec2): number
        distance2Squared(p1: vec2, p2: vec2): number
        distanceToSegmentSquared(p: vec2, lp1: vec2, lp2: vec2): number
        distanceToSegment(p: vec2, lp1: vec2, lp2: vec2): number

        polyOrient(points: vec2[]): number
        inside2(polygon: Polygon, { x, y }: vec2): boolean
    }
}
