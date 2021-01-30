// production
import * as _ from './Button'
globally(_, 'UIKit')

declare global {
    namespace UIKit {
        type ButtonProps = _.ButtonProps
        const Button: typeof _.Button
    }
}
