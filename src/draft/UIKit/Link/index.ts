// production
import * as _ from './Link'
globally(_, 'UIKit')

declare global {
    namespace UIKit {
        const Link: typeof _.Link
    }
}
