export function intersect2(p1: vec2, p2: vec2, p3: vec2, p4: vec2, limit: boolean): Intersect2 {
    const { abs } = Math

    const ady = p1.y - p2.y
    const adx = p2.x - p1.x
    const bdy = p3.y - p4.y
    const bdx = p4.x - p3.x

    const D = D2(ady, adx, bdy, bdx)
    if (abs(D) <= Number.EPSILON) {
        return {
            isIntersect: false,
        }
    }

    const aC = adx * p1.y + ady * p1.x
    const bC = bdx * p3.y + bdy * p3.x
    const DX = D2(aC, adx, bC, bdx)
    const DY = D2(ady, aC, bdy, bC)

    const intersect = {
        isIntersect: true,
        x: DX / D,
        y: DY / D,
    }

    if (limit) {
        const { min, max } = Math
        const minX1 = min(p1.x, p2.x) - 1
        const maxX1 = max(p1.x, p2.x) + 1
        const minX2 = min(p3.x, p4.x) - 1
        const maxX2 = max(p3.x, p4.x) + 1
        if (
            intersect.x < minX1 ||
            intersect.x > maxX1 ||
            intersect.x < minX2 ||
            intersect.x > maxX2
        ) {
            intersect.isIntersect = false
            return intersect
        }

        const minY1 = min(p1.y, p2.y) - 1
        const maxY1 = max(p1.y, p2.y) + 1
        const minY2 = min(p3.y, p4.y) - 1
        const maxY2 = max(p3.y, p4.y) + 1
        if (
            intersect.y < minY1 ||
            intersect.y > maxY1 ||
            intersect.y < minY2 ||
            intersect.y > maxY2
        ) {
            intersect.isIntersect = false
            return intersect
        }
    }

    return intersect
}

function D2(a11: number, a12: number, a21: number, a22: number) {
    return a11 * a22 - a12 * a21
}
