import { State } from './_State'

export interface Tool {
    onLeftMouseDown (x: number, y: number): void
    onLeftMouseUp (x: number, y: number): void
    onRightMouseDown (x: number, y: number): void
    onRightMouseUp (x: number, y: number): void
    onMouseMove (x: number, y: number): void
    onKeyDown (code: string): void
    onKeyUp (code: string): void
}

export abstract class Tool implements Tool {
    state: State

    @mobx.observable mode: string = ''

    constructor (state: State) {
        this.state = state
    }
}
