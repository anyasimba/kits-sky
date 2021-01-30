// production
import * as _ from './InputGroup'
globally(_, 'UIKit')

declare global {
    namespace UIKit {
        const InputGroup: typeof _.InputGroup
    }
}
