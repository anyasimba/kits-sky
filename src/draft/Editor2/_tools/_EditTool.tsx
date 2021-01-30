// production
import { b } from '../_b'
import { Tool } from '../_Tool'

export class EditTool extends Tool {
    @mobx.observable mouse: vec2 = null
    @mobx.observable pointIdx: number = null
    @mobx.observable segmentIdx: number = null

    @mobx.action onLeftMouseDown (x: number, y: number) {
        const {
            state,
            mode,
            pointIdx,
            segmentIdx,
        } = this

        const {
            polygonsState,
        } = state

        const mouse = this.mouse = state.toLocalPoint(new vec2({x, y}))
        
        if (mode === '') {
            polygonsState.selectedPolygon = null
            polygonsState.polygons.some(polygon => {
                if (Math.inside2(polygon, mouse)) {
                    polygonsState.selectedPolygon = polygon
                    this.mode = 'selected'
                    return
                }
            })
        } else if (mode === 'selected') {
            if (pointIdx != null) {
                this.mode = 'move point'
            } else if (this.segmentIdx != null) {
                const polygon = polygonsState.selectedPolygon
                polygon.points.splice((segmentIdx+1)%polygon.points.length, 0, new vec2(mouse))
            }
        }
    }

    @mobx.action onLeftMouseUp (x: number, y: number) {
        if (this.mode === 'move point') {
            this.mode = 'selected'
        }
    }

    @mobx.action onRightMouseDown (x: number, y: number) {
        const {
            state,
            mode,
            pointIdx,
        } = this

        const {
            polygonsState,
        } = state

        if (mode === 'selected') {
            const polygon = polygonsState.selectedPolygon
            if (pointIdx != null && polygon.points.length > 3) {
                polygonsState.removePoint(polygon, pointIdx)
                this.pointIdx = null
            }
        }
    }
    
    @mobx.action onRightMouseUp (x: number, y: number) {}

    @mobx.action onMouseMove (x: number, y: number) {
        const {
            state,
            mode,
            pointIdx,
        } = this

        const {
            polygonsState,
            transformState,
        } = this.state

        const {
            realScale,
        } = transformState

        const mouse = this.mouse = state.toLocalPoint(new vec2({x, y}))

        if (mode === 'selected') {
            const polygon = polygonsState.selectedPolygon
            const { points } = polygon
            this.pointIdx = null
            this.segmentIdx = null
            let savedDistance = null
            for (let i = 0; i < points.length; i++) {
                const sp1 = points[i]
                const distanceToPoint = Math.distance2Squared(mouse, sp1)
                if (distanceToPoint < 20 / realScale) {
                    this.pointIdx = i
                    break
                }
                const sp2 = points[(i + 1)%points.length]
                const distance = Math.distanceToSegmentSquared(mouse, sp1, sp2)
                if (!savedDistance || distance < savedDistance) {
                    savedDistance = distance
                    this.segmentIdx = i
                }
            }
        } else if (mode === 'move point') {
            const polygon = polygonsState.selectedPolygon
            const p = polygon.points[pointIdx]
            p.x = mouse.x
            p.y = mouse.y
            state.forceUpdate()
        }
    }

    onKeyDown (code: string) {}
    onKeyUp (code: string) {}

    Element () {
        const {
            state,
            mouse,
            pointIdx,
            segmentIdx,
        } = this

        const {
            polygonsState,
            transformState,
        } = this.state

        if (this.mode !== 'selected') {
            return null
        }

        const PointComponent = (p, key) => {
            const size = 12/transformState.scale
        
            return (
                <svg
                    key={`edit-point-${key}`}
                    className={b('edit-point')}
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        strokeWidth: 0,
                        transform: `translate(${p.x - size*0.5}px, ${p.y - size*0.5}px)`,
                    }}
                >
                    <circle cx={size*0.5} cy={size*0.5} r={size*0.5-1/transformState.scale}/>
                </svg>
            )
        }
        
        const LineComponent = (p1, p2, key) => {
            const base = {
                x: Math.min(p1.x, p2.x),
                y: Math.min(p1.y, p2.y),
            }
            
            return (
                <svg
                    key={`edit-line-${key}`}
                    className={b('edit-line')}
                    style={{
                        width: `${Math.max(Math.abs(p1.x - p2.x), 4)}px`,
                        height: `${Math.max(Math.abs(p1.y - p2.y), 4)}px`,
                        strokeWidth: 1/transformState.scale,
                        transform: `translate(${base.x}px, ${base.y}px)`,
                    }}
                >
                    <polyline points={`${p1.x-base.x},${p1.y-base.y} ${p2.x-base.x},${p2.y-base.y}`}></polyline>    
                </svg>
            )
        }

        if (pointIdx != null) {
            const polygon = polygonsState.selectedPolygon
            const point = polygon.points[pointIdx]
            return (
                <>
                    {PointComponent(point, 'circle')}
                </>
            )
        }
        if (segmentIdx != null) {
            const polygon = polygonsState.selectedPolygon
            return (
                <>
                    {PointComponent(mouse, 'circle')}
                    {LineComponent(mouse, polygon.points[segmentIdx], 'line1')}
                    {LineComponent(mouse, polygon.points[(segmentIdx + 1)%polygon.points.length], 'line2')}
                </>
            )
        }
    }
}
