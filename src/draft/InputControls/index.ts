import * as _ from './InputControls'
globally(_)

declare global {
    type InputControlsEvent = _.InputControlsEvent
    const InputControlsEvent: typeof _.InputControlsEvent

    type InputControls = _.InputControls
    const InputControls: typeof _.InputControls
}
