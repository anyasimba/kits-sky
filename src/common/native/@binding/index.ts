import * as _ from './_'
globalify(_)

declare global {
    type NativeArray<T> = _.NativeArray<T>

    type Native = _.Native
    const Native: typeof _.Native

    type native = _.native
    const native: typeof _.native
}
