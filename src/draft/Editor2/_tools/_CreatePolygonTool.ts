// production
import { Tool } from '../_Tool'

export class CreatePolygonTool extends Tool {
    onLeftMouseDown (x: number, y: number) {
        const {
            state,
        } = this

        const {
            polygonsState,
        } = state

        const mouse = new vec2({x, y})
        
        if (this.mode === '') {
            polygonsState.addPolygon()
            this.mode = 'created'
            polygonsState.addPoint(polygonsState.polygon, state.toLocalPoint(mouse))
        } else if (this.mode === 'created') {
            polygonsState.addPoint(polygonsState.polygon, state.toLocalPoint(mouse))
        }
    }

    onLeftMouseUp (x: number, y: number) {}
    
    onRightMouseDown (x: number, y: number) {
        const {
            polygonsState,
        } = this.state

        const {
            polygon,
        } = polygonsState

        const { points } = polygon

        if (points.length > 0) {
            polygonsState.removePoint(polygon, points.length - 1)
        }
    }

    onRightMouseUp (x: number, y: number) {}
    onMouseMove (x: number, y: number) {}
    onKeyDown (code: string) {}
    onKeyUp (code: string) {
        const {
            polygonsState,
            toolsState,
        } = this.state

        const {
            tools,
        } = toolsState

        const {
            polygon,
        } = polygonsState

        if (code === 'Enter') {
            toolsState.tool = tools.edit
            toolsState.tool.mode = ''
        }
    }
}
