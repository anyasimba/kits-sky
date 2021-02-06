import 'sky/common/EventEmitter'
import * as _ from './@'
globalify(_)

// eslint-disable-next-line no-console
console.log('No worries!')

declare global {
    const commit: typeof _.commit
    const Self: typeof _.Self
    function useEffect(cb: () => (...args: any[]) => void): void
}
