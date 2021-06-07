import './AABB'
import './Polygon'
import './Polyline'

import * as _ from './_'
globalify(_, Math)

declare global {
    interface Math {
        distance2(p1: vec2, p2: vec2): number
        distanceSquared2(p1: vec2, p2: vec2): number
        distanceToSegmentSquared2(p: vec2, lp1: vec2, lp2: vec2): number
        distanceToSegment2(p: vec2, lp1: vec2, lp2: vec2): number

        polyOrient(points: vec2[]): number
        inside2(polygon: Polygon, { x, y }: vec2): boolean
    }
}
