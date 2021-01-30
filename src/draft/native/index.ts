declare const global
if (global.Module) {
    global.native = global.Module
    global.nativePointer = function (pointer) {
        return pointer.pointer()
    }
}

import * as _ from './native'
globally(_)

declare global {
    const native: { [x: string]: any }
    function nativePointer(pointer)

    type Native = _.Native
    const Native: typeof _.Native

    type NativeArray<T> = _.NativeArray<T>

    type native_class = _.native_class
    const native_class: typeof _.native_class

    type native_prop = _.native_prop
    const native_prop: typeof _.native_prop

    type native_method = _.native_method
    const native_method: typeof _.native_method
}
