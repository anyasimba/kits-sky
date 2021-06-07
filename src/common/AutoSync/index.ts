import * as _ from './_'
globalify(_)

declare global {
    type AutoSync<T> = _.AutoSync<T>
    const AutoSync: typeof _.AutoSync

    type GlobalVisibility = _.GlobalVisibility
    const GlobalVisibility: typeof _.GlobalVisibility

    type Observer = _.Observer
    const Observer: typeof _.Observer

    type Visibility = _.Visibility
}
