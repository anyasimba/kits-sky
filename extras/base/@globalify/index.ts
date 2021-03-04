import { globalify } from './globalify'
import * as _ from './globalify'
globalify(_)

declare global {
    type globalify = _.globalify
    function globalify(module: object, target?: object | string)
}
