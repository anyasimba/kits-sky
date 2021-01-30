// production
import { globally } from './globally'
import * as _ from './globally'
globally(_)

declare global {
    type globally = _.globally
    function globally(module: object, target?: object | string)
}
