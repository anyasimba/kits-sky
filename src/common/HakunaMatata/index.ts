import 'sky/common/EventEmitter'
import * as _ from './_'
globalify(_)

// eslint-disable-next-line no-console
console.log('No worries!')

declare global {
    const root: typeof _.root

    type link = _.link
    const link: typeof _.link

    type HakunaMatata = _.HakunaMatata
    const HakunaMatata: typeof _.HakunaMatata

    // lib
    type Timeout = _.Timeout
    const Timeout: typeof _.Timeout
    type TimeoutWithDt = _.TimeoutWithDt
    const TimeoutWithDt: typeof _.TimeoutWithDt

    type Interval = _.Interval
    const Interval: typeof _.Interval
    type IntervalWithDt = _.IntervalWithDt
    const IntervalWithDt: typeof _.IntervalWithDt

    type AnimationFrame = _.AnimationFrame
    const AnimationFrame: typeof _.AnimationFrame
    type AnimationFrameWithDt = _.AnimationFrameWithDt
    const AnimationFrameWithDt: typeof _.AnimationFrameWithDt

    type AnimationFrames = _.AnimationFrames
    const AnimationFrames: typeof _.AnimationFrames
    type AnimationFramesWithDt = _.AnimationFramesWithDt
    const AnimationFramesWithDt: typeof _.AnimationFramesWithDt
}
