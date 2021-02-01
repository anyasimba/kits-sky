import * as _underscore from './underscore'
globally(_underscore)

declare global {
    const _: typeof _underscore._
}
