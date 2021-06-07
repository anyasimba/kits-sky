import 'sky/common/EventEmitter'
import * as _ from './_'
globalify(_)

// eslint-disable-next-line no-console
console.log('No worries!')

declare global {
    type link = _.link
    const link: typeof _.link

    type HakunaMatata = _.HakunaMatata
    const HakunaMatata: typeof _.HakunaMatata

    // lib
    type Timeout = _.Timeout
    const Timeout: typeof _.Timeout

    type Interval = _.Interval
    const Interval: typeof _.Interval

    type AnimationFrame = _.AnimationFrame
    const AnimationFrame: typeof _.AnimationFrame

    type AnimationFrames = _.AnimationFrames
    const AnimationFrames: typeof _.AnimationFrames
}
