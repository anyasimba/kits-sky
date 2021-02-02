// production
import * as _ from './Button'
globalify(_, 'UIKit')

declare global {
    namespace UIKit {
        type ButtonProps = _.ButtonProps
        const Button: typeof _.Button
    }
}
