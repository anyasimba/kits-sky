// production
import * as _ from './DropDown'
globalify(_, 'UIKit')

declare global {
    namespace UIKit {
        const DropDown: typeof _.DropDown
        const DropDownButton: typeof _.DropDownButton
        const DropDownContent: typeof _.DropDownContent
    }
}
