import * as _ from '@anyasimba/f'
globalify(_)

declare global {
    const Self: typeof _.Self
    const F: typeof _.F
}
