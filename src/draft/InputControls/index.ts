import * as _ from './InputControls'
globalify(_)

declare global {
    type InputControlsEvent = _.InputControlsEvent
    const InputControlsEvent: typeof _.InputControlsEvent

    type InputControls = _.InputControls
    const InputControls: typeof _.InputControls
}
