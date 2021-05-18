export function distance2(p1: vec2, p2: vec2) {
    return sqr(p1.x - p2.x) + sqr(p1.y - p2.y)
}

export function distanceSquared2(p1: vec2, p2: vec2) {
    return Math.sqrt(distance2(p1, p2))
}

export function distanceToSegmentSquared2(p: vec2, sp1: vec2, sp2: vec2) {
    const l2 = distance2(sp1, sp2)
    if (l2 == 0) {
        return distance2(p, sp1)
    }

    let t = ((p.x - sp1.x) * (sp2.x - sp1.x) + (p.y - sp1.y) * (sp2.y - sp1.y)) / l2
    t = Math.max(0, Math.min(1, t))

    return distance2(
        p,
        new vec2({
            x: sp1.x + t * (sp2.x - sp1.x),
            y: sp1.y + t * (sp2.y - sp1.y),
        })
    )
}

export function distanceToSegment2(p: vec2, sp1: vec2, sp2: vec2) {
    return Math.sqrt(distanceToSegmentSquared2(p, sp1, sp2))
}

function sqr(x: number) {
    return x * x
}
