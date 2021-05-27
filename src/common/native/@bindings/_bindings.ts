import 'sky/common/HakunaMatata'

const $$native = Symbol('native')
const $$nativeConstructor = Symbol('nativeConstructor')

let props: any[] = []
let methods: any[] = []
const classes: any = {}

const wraps: any = {}

export interface NativeArray<T> {
    readonly length: number
    readonly items: T[]
    get(idx: number): T
    set(idx: number, value: T): void
    add(value: T): void
    remove(value: T): void
    clear(): void
}

declare const global: any

export class Native extends HakunaMatata {
    constructor() {
        super()
        ;(this as any)[$$nativeConstructor].call(this)
    }
}

export type native = typeof native
export const native = {
    class(name: string, ...mixins: any[]) {
        return function (constructor: any) {
            const { prototype } = constructor

            {
                const getDisposed = global.___NATIVE[`${name}_get_disposed`]
                const setDisposed = global.___NATIVE[`${name}_set_disposed`]
                Object.defineProperty(prototype, 'disposed', {
                    get: function () {
                        return getDisposed(this[$$native])
                    },
                    set: function (v) {
                        return setDisposed(this[$$native], v)
                    },
                    enumerable: true,
                    configurable: true,
                })
            }
            for (let i = 0; i < mixins.length; ++i) {
                const { props, methods } = classes[mixins[i]]
                apply(name, prototype, props, methods)
            }
            apply(name, prototype, props, methods)

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

            constructor.props = props
            constructor.methods = methods
            classes[name] = constructor

            props = []
            methods = []

            return constructor
        }
    },

    prop(type: string) {
        return function (_: any, key: string) {
            props.push({ type, key })
        }
    },

    method(returnType: string, ...args: any[]) {
        return function (_: any, key: string) {
            methods.push({ returnType, args, key })
        }
    },
}

function pointer(native: any): number {
    if (global.___NATIVE.pointer) {
        return global.___NATIVE.pointer(native)
    }
    return native.pointer()
}

function unwrapArgs(args: any[], unwraps: any[]) {
    for (let i = 0; i < unwraps.length; ++i) {
        unwraps[i](args)
    }
}

function ArgUnwrap(arg: string) {
    if (arg.indexOf('*') === -1) {
        return
    }
    let unwrap = (v: any) => {
        return v[$$native]
    }
    const j = (arg.lastIndexOf('<') + 1) / 6
    for (let k = 0; k < j; ++k) {
        const prevUnwrap = unwrap
        unwrap = v => {
            v = v.map(prevUnwrap)
        }
    }
    return unwrap
}

function ArgWrap(arg: string) {
    if (arg.indexOf('*') === -1) {
        return
    }
    let wrap = (v: any) => {
        const key = pointer(v)
        return wraps[key]
    }
    const j = (arg.lastIndexOf('<') + 1) / 6
    for (let k = 0; k < j; ++k) {
        const prevWrap = wrap
        wrap = v => {
            v = v.map(prevWrap)
        }
    }
    return wrap
}

function apply(name: string, prototype: any, props: any, methods: any) {
    for (let i = 0; i < props.length; i++) {
        const prop = props[i]
        if (prop.type.indexOf('<') !== -1) {
            applyArrayProp(name, prototype, prop)
        } else {
            applyProp(name, prototype, prop)
        }
    }

    for (let i = 0; i < methods.length; i++) {
        const method = methods[i]
        applyMethod(name, prototype, method)
    }
}

function applyArrayProp(name: string, prototype: any, prop: any) {
    const length = global.___NATIVE[`${name}_array_length_${prop.key}`]
    const get = global.___NATIVE[`${name}_array_get_${prop.key}`]
    const set = global.___NATIVE[`${name}_array_set_${prop.key}`]
    const add = global.___NATIVE[`${name}_array_add_${prop.key}`]
    const remove = global.___NATIVE[`${name}_array_remove_${prop.key}`]
    const clear = global.___NATIVE[`${name}_array_clear_${prop.key}`]

    const baseType = prop.type.slice(prop.type.lastIndexOf('<') + 1, prop.type.indexOf('>'))

    const key = Symbol(prop.key)
    if (baseType.indexOf('*') !== -1) {
        const wrap = ArgWrap(baseType)!
        const unwrap = ArgUnwrap(baseType)!
        Object.defineProperty(prototype, prop.key, {
            get() {
                const native = this[$$native]
                const self = this
                this[key] = this[key] || {
                    get length() {
                        return length(native)
                    },
                    get items() {
                        const items = []
                        const len = length(native)
                        for (let i = 0; i < len; i++) {
                            const item = wrap(get(native, i))
                            items.push(item)
                        }
                        return items
                    },
                    get(idx: number) {
                        return wrap(get(native, idx))
                    },
                    add(value: HakunaMatata) {
                        ;(value as any).__attachTo(this, () => remove(native, unwrap(value)))
                        self.__childs.push(value)
                        add(native, unwrap(value))
                    },
                    remove(value: any) {
                        self.remove(value)
                        remove(native, unwrap(value))
                    },
                    clear() {
                        const len = length(native)
                        for (let i = 0; i < len; i++) {
                            const value = wrap(get(native, i))
                            self.remove(value)
                        }
                        clear(native)
                    },
                }
                return this[key]
            },
        })
    } else {
        Object.defineProperty(prototype, prop.key, {
            get() {
                const native = this[$$native]
                this[key] = this[key] || {
                    get length() {
                        return length(native)
                    },
                    get items() {
                        const items = []
                        const len = length(native)
                        for (let i = 0; i < len; i++) {
                            const item = get(native, i)
                            items.push(item)
                        }
                        return items
                    },
                    get(idx: number) {
                        return get(native, idx)
                    },
                    set(idx: number, v: any) {
                        set(native, idx, v)
                    },
                    add(v: any) {
                        add(native, v)
                    },
                    remove(v: any) {
                        remove(native, v)
                    },
                    clear() {
                        clear(native)
                    },
                }
                return this[key]
            },
        })
    }
}

function applyProp(name: string, prototype: any, prop: any) {
    const get = global.___NATIVE[`${name}_get_${prop.key}`]
    const set = global.___NATIVE[`${name}_set_${prop.key}`]
    if (prop.type.indexOf('*') !== -1) {
        const key = Symbol(prop.key)
        Object.defineProperty(prototype, prop.key, {
            get() {
                return wraps[get(this[$$native])]
            },
            set(value) {
                const currentPointer = pointer(get(this[$$native]))
                if (currentPointer !== 0) {
                    this.remove(wraps[currentPointer])
                }
                if (value) {
                    ;(value as any).__attachTo(this, () => set(this[$$native], null))
                    this.__childs.push(value)
                    set(this[$$native], value[$$native])
                } else {
                    set(this[$$native], null)
                }
            },
        })
    } else {
        Object.defineProperty(prototype, prop.key, {
            get: function () {
                return get(this[$$native])
            },
            set: function (v) {
                return set(this[$$native], v)
            },
            enumerable: true,
            configurable: true,
        })
    }
}

function applyMethod(name: string, prototype: any, method: any) {
    const fn = global.___NATIVE[`${name}_${method.key}`]
    const unwraps: any[] = []
    for (let i = 0; i < method.args.length; ++i) {
        const unwrap = ArgUnwrap(method.args[i])
        if (unwrap != null) {
            unwraps.push((args: any[]) => {
                args[i] = unwrap(args[i])
            })
        }
    }

    const returnWrap = ArgWrap(method.returnType)
    if (returnWrap) {
        if (unwraps.length > 0) {
            prototype[method.key] = function (...args: any[]) {
                unwrapArgs(args, unwraps)
                return returnWrap(fn(this[$$native], ...args))
            }
        } else {
            prototype[method.key] = function (...args: any[]) {
                return returnWrap(fn(this[$$native], ...args))
            }
        }
    } else {
        if (unwraps.length > 0) {
            prototype[method.key] = function (...args: any[]) {
                unwrapArgs(args, unwraps)
                return fn(this[$$native], ...args)
            }
        } else {
            prototype[method.key] = function (...args: any[]) {
                return fn(this[$$native], ...args)
            }
        }
    }
}
