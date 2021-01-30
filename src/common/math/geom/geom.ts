export * from './@@distance'

export function polyOrient(points: vec2[]): number {
    const { length } = points
    let orient = 0
    for (let i = 0; i < points.length; ++i) {
        const p1 = points[i]
        const p2 = points[(i + 1) % length]
        const p3 = points[(i + 2) % length]

        orient += (p1.x - p3.x) * (p1.y - p2.y) - (p1.y - p3.y) * (p1.x - p2.x)
    }
    return orient
}

export function inside2(polygon: Polygon, { x, y }: vec2) {
    const { points } = polygon

    let inside = false
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const xi = points[i].x
        const yi = points[i].y
        const xj = points[j].x
        const yj = points[j].y

        const intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
        if (intersect) {
            inside = !inside
        }
    }

    return inside
}
