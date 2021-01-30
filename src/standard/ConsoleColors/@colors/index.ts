// production
import * as colors from './colors'
globally({ colors }, console)

declare global {
    interface Console {
        colors: typeof colors
    }
}
