import { $$native, $$nativeConstructor, classes, currentState, pointer, wraps } from './__'
import { apply } from './_apply'

declare const global: any

export type native = typeof native
export const native = {
    class(name: string, ...mixins: any[]) {
        return function (constructor: any) {
            const { prototype } = constructor

            {
                const getDisposed = global.___NATIVE[`${name}_get_disposed`]
                const setDisposed = global.___NATIVE[`${name}_set_disposed`]
                Object.defineProperty(prototype, '__disposed', {
                    get: function () {
                        return getDisposed(this[$$native])
                    },
                    set: function (v) {
                        return setDisposed(this[$$native], v)
                    },
                })
            }
            for (let i = 0; i < mixins.length; ++i) {
                const { props, methods } = classes[mixins[i]]
                apply(name, prototype, props, methods)
            }
            apply(name, prototype, currentState.props, currentState.methods)

            const nativeConstructor = global.___NATIVE[name]
            const nativeDestructor = global.___NATIVE[`${name}_destroy`]

            constructor.prototype[$$nativeConstructor] = function (...args: any[]) {
                this.use(() => {
                    this[$$native] = nativeConstructor(...args)
                    const key = pointer(this[$$native])
                    wraps[key] = this
                    return () => {
                        delete wraps[key]
                        nativeDestructor(this[$$native])
                    }
                })
            }

            constructor.props = currentState.props
            constructor.methods = currentState.methods
            classes[name] = constructor

            currentState.props = []
            currentState.methods = []

            return constructor
        }
    },

    prop(type: string) {
        return function (_: any, key: string) {
            currentState.props.push({ type, key })
        }
    },

    method(returnType: string, ...args: any[]) {
        return function (_: any, key: string) {
            currentState.methods.push({ returnType, args, key })
        }
    },
}
