import * as _underscore from './_'
globalify(_underscore)

declare global {
    const _: typeof _underscore._
}
