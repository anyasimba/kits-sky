import 'sky/common/HakunaMatata'
import * as _ from './effects'
globally(_)

declare global {
    const Timeout: typeof _.Timeout
    const Interval: typeof _.Interval
    const HTMLEventListener: typeof _.HTMLEventListener
    const AnimationFrame: typeof _.AnimationFrame
}
