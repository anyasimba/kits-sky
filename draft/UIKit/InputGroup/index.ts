// production
import * as _ from './InputGroup'
globalify(_, 'UIKit')

declare global {
    namespace UIKit {
        const InputGroup: typeof _.InputGroup
    }
}
