import 'sky/common/EventEmitter'
import * as _ from './@'
globalify(_)

// eslint-disable-next-line no-console
console.log('No worries!')

declare global {
    type link = _.link
    const link: typeof _.link

    type effect = _.effect
    const effect: typeof _.effect

    type HakunaMatata = _.HakunaMatata
    const HakunaMatata: typeof _.HakunaMatata
}
