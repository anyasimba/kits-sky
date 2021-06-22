import 'sky/common/HakunaMatata'
import * as _ from './_'
globalify(_)

declare global {

    type AutoSync = _.AutoSync
    const AutoSync: typeof _.AutoSync

    type AutoSyncObserver = _.AutoSyncObserver
    const AutoSyncObserver: typeof _.AutoSyncObserver
}
