import 'sky/common/EventEmitter'
import * as _ from './@'
globalify(_)

// eslint-disable-next-line no-console
console.log('No worries!')

declare global {
    function use(cb: () => ((...args: any[]) => void) | void): void

    type HakunaMatata = _.HakunaMatata
    const HakunaMatata: typeof _.HakunaMatata
}
