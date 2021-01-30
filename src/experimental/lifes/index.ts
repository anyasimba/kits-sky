import 'sky/experimental/HakunaMatata'
import * as _ from './lifes'
globally(_)

declare global {
    type Timeout = _.Timeout
    const Timeout: typeof _.Timeout

    type Interval = _.Interval
    const Interval: typeof _.Interval

    type AnimationFrame = _.AnimationFrame
    const AnimationFrame: typeof _.AnimationFrame

    type EventHandler = _.EventHandler
    const EventHandler: typeof _.EventHandler
}
