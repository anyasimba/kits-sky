import * as _ from './_'
globalify(_)

declare global {
    type StaticNativeArray<T> = _.StaticNativeArray<T>
    type NativeArray<T> = _.NativeArray<T>
    type NativeArrayOfNative<T> = _.NativeArrayOfNative<T>
    type StaticNativeArrayOfNative<T> = _.StaticNativeArrayOfNative<T>

    type Native = _.Native
    const Native: typeof _.Native

    type native = _.native
    const native: typeof _.native
}
