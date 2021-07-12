import 'sky/common/HakunaMatata'
import * as _ from './_'
globalify(_)

declare global {
    type access = _.access
    const access: typeof _.access

    type array<T> = _.array<T>
    const array: typeof _.array

    type AutoSync = _.AutoSync
    const AutoSync: typeof _.AutoSync

    type listen = _.listen
    const listen: typeof _.listen

    type watch = _.watch
    const watch: typeof _.watch

    type Watcher = _.Watcher
    const Watcher: typeof _.Watcher
}
