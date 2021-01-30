import { b } from './_b'
import { State } from './_State'

import { EditTool } from './_tools/_EditTool'

interface Props {
    state: State
}

export const Polygons = mobx.observer(({state}: Props) => {
    const {
        transformState,
        toolsState,
        polygonsState,
    } = state

    const {
        tool,
        tools,
    } = toolsState

    const {
        polygons,
        selectedPolygon,
    } = polygonsState

    const PointComponent = (p, i, j) => {
        const size = 10

        return (
            <svg
                key={`point-${i}-${j}`}
                className={b('point')}
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    strokeWidth: 2/transformState.scale,
                    transform: `translate(${p.x - size*0.5}px, ${p.y - size*0.5}px)`,
                }}
            >
                <polyline points={`0,0 ${size},0 ${size},${size} 0,${size} 0,0`}></polyline>    
            </svg>
        )
    }

    const LineComponent = (p1, p2, i, j) => {
        const base = {
            x: Math.min(p1.x, p2.x),
            y: Math.min(p1.y, p2.y),
        }
        
        return (
            <svg
                key={`line-${i}-${j}`}
                className={b('line')}
                style={{
                    width: `${Math.max(Math.abs(p1.x - p2.x), 4)}px`,
                    height: `${Math.max(Math.abs(p1.y - p2.y), 4)}px`,
                    strokeWidth: 2/transformState.scale,
                    transform: `translate(${base.x}px, ${base.y}px)`,
                }}
            >
                <polyline points={`${p1.x-base.x},${p1.y-base.y} ${p2.x-base.x},${p2.y-base.y}`}></polyline>    
            </svg>
        )
    }

    const $polygons = []
    polygons.forEach((polygon, i) => {
        const children = []
        const { points } = polygon
        points.forEach((p, j) => {
            children.push(PointComponent(p, i, j))
            const p2 = points[(j + 1)%points.length]
            children.push(LineComponent(p, p2, i, j))
        })

        let isSelected = false
        if (tool === tools.edit || tool === tools.move) {
            isSelected = selectedPolygon === polygon
        }
        
        const classNames = classnames(
            b('polygon'),
            isSelected && b('polygon', {selected: true}),
        )

        $polygons.push(
            <div className={classNames} key={$polygons.length-1}>
                {children}
            </div>
        )
    })
    let $editToolElement
    if (tool === tools.edit) {
        const edit = tool as EditTool
        $editToolElement = edit.Element()
    }

    return <>
        {$polygons}
        {$editToolElement}
    </>
})