import 'sky/common/HakunaMatata/EventEmitter'
import * as _ from './_'
globalify(_)

declare global {
    type Shared = _.Shared
    const Shared: typeof _.Shared

    type AutoSync = _.AutoSync
    const AutoSync: typeof _.AutoSync

    type AutoSyncObserver = _.AutoSyncObserver
    const AutoSyncObserver: typeof _.AutoSyncObserver
}
