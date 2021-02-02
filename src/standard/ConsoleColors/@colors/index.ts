// production
import * as colors from './colors'
globalify({ colors }, console)

declare global {
    interface Console {
        colors: typeof colors
    }
}
