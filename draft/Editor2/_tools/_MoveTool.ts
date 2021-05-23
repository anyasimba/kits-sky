// production
import { Tool } from '../_Tool'

export class MoveTool extends Tool {
    mouseDown: vec2 = new vec2
    savedShift: vec2 = new vec2

    onLeftMouseDown (x: number, y: number) {
        const {
            state,
            mouseDown,
            savedShift,
        } = this

        const {
            transformState,
        } = state

        const {
            shift,
        } = transformState

        mouseDown.x = x
        mouseDown.y = y
        savedShift.x = shift.x
        savedShift.y = shift.y

        this.mode = 'move'
    }
    
    onLeftMouseUp (x: number, y: number) {
        this.mode = ''
    }

    onRightMouseDown (x: number, y: number) {}
    onRightMouseUp (x: number, y: number) {}

    onMouseMove (x: number, y: number) {
        const {
            state,
            mouseDown,
            savedShift,
        } = this

        const {
            transformState,
        } = state

        const {
            scale,
        } = transformState
        
        if (this.mode === 'move') {
            transformState.shift = {
                x: savedShift.x + (x - mouseDown.x) / scale,
                y: savedShift.y + (y - mouseDown.y) / scale,
            }
        }
    }

    onKeyDown (code: string) {}
    onKeyUp (code: string) {}
}
