// production
import * as _ from './Link'
globalify(_, 'UIKit')

declare global {
    namespace UIKit {
        const Link: typeof _.Link
    }
}
