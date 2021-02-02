import * as _ from './sleep'
globalify(_)

declare global {
    function sleep(time: number)
}
