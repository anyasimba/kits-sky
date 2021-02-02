import * as _underscore from './underscore'
globalify(_underscore)

declare global {
    const _: typeof _underscore._
}
