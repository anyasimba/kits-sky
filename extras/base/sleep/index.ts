import * as _ from './sleep'
globally(_)

declare global {
    function sleep(time: number)
}
