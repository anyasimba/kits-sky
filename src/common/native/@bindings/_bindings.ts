// const $$native = Symbol('native')

// const props = []
// const methods = []
// const classes = {}

// const wraps = {}

// export interface NativeArray<T> {
//     readonly length: number
//     readonly items: T[]
//     get(idx: number): T
//     set(idx: number, value: T): void
//     add(value: T): void
//     forceAdd(value: T): void
//     remove(value: T): void
//     forceRemove(value: T): void
//     clear(): void
// }

// // export const Phys2Body = Native((shape: any, density: number) => {
// //     const self = Native((prop, method) => ({
// //         shape: prop<any>('Shape*'),
// //         forces: prop<NativeArray<Phys2Force>>('Array<Phys2Force*>'),
// //         position: prop<vec2>('vec2'),
// //         velocity: prop<vec2>('vec2'),
// //         angularVelocity: prop('number') as number,
// //         torque: prop('number') as number,
// //         orient: prop<number>('number', 0),
// //         I: prop('number', 1) as number,
// //         iI: prop('number', 1) as number,
// //         m: prop('number', 1) as number,
// //         im: prop('number', 1) as number,
// //         staticFriction: prop('Shape*') as number,
// //         dynamicFriction: prop('Shape*') as number,
// //         restitution: prop('Shape*') as number,
// //     }))

// //     const _ = Native((prop, method) => ({
// //         init: method(['number']) as (density: number) => void,
// //         setOrient: method<(orient: number) => void>(['number']),
// //     }))

// //     use(() => {
// //         self.shape = shape
// //         _.init(density)
// //         _.setOrient(0)
// //     })

// //     return self
// // })

// function Native<T>(fn: (prop: typeof nativeProp, method: typeof nativeMmethod) => T) {
//     return fn(nativeProp, nativeMmethod)
// }
// function nativeProp<T>(type: string, initialValue?: T): T {
//     return initialValue as T
// }
// function nativeMmethod<T>(args: string[], returnType?: string): T {
//     return null as any
// }

// declare const global

// const Native = Effect((className: string, ...mixins) => {
//     const self = Self(Effect, () => ({
//         get dead() {
//             return getDead(native)
//         },
//         set dead(value) {
//             setDead(native, value)
//         },
//     }))

//     let native: any = null
//     use(() => {
//         const createNative = global.native[className]
//         const destroyNative = global.native[`${className}_destroy`]
//         native = createNative()
//         const key = native.pointer()
//         nativeWraps[key] = self
//         return () => {
//             delete nativeWraps[key]
//             destroyNative(native)
//             native = null
//         }
//     })

//     const getDead = global.native[`${className}_get_dead`]
//     const setDead = global.native[`${className}_set_dead`]

//     // for (let i = 0; i < mixins.length; ++i) {
//     //     const { props, methods } = nativeClasses[mixins[i]]
//     //     apply(name, prototype, props, methods)
//     // }
//     // apply(name, prototype, props, methods)

//     return self
// })

// export type native_class = typeof native_class
// export function native_class(name, ...mixins) {
//     return function (constructor) {
//         const { prototype } = constructor

//         {
//             const get = native[`${name}_get_disposed`]
//             const set = native[`${name}_set_disposed`]
//             Object.defineProperty(prototype, 'dead', {
//                 get: function () {
//                     return get(this[__.$$native])
//                 },
//                 set: function (v) {
//                     return set(this[__.$$native], v)
//                 },
//                 enumerable: true,
//                 configurable: true,
//             })
//         }
//         for (let i = 0; i < mixins.length; ++i) {
//             const { props, methods } = nativeClasses[mixins[i]]
//             apply(name, prototype, props, methods)
//         }
//         apply(name, prototype, props, methods)

//         const nativeConstructor = native[name]
//         const nativeDestructor = native[`${name}_destroy`]

//         constructor.prototype[__.$$nativeConstructor] = nativeConstructor
//         constructor.prototype.destructor = function () {
//             const key = (this[__.$$native] as any).pointer()
//             delete nativeWraps[key]
//             nativeDestructor(this[__.$$native])
//         }

//         constructor.props = props
//         constructor.methods = methods
//         nativeClasses[name] = constructor

//         props = []
//         methods = []

//         return circle_of_life(constructor)
//     }
// }

// export type native_prop = typeof native_prop
// export function native_prop(type) {
//     return function (_, key: string) {
//         props.push({ type, key })
//     }
// }

// export type native_method = typeof native_method
// export function native_method(returnType, ...args) {
//     return function (_, key: string) {
//         methods.push({ returnType, args, key })
//     }
// }

// function unwrapArgs(args, unwraps) {
//     for (let i = 0; i < unwraps.length; ++i) {
//         unwraps[i](args)
//     }
// }

// function ArgUnwrap(arg: string) {
//     if (arg.indexOf('*') === -1) {
//         return
//     }
//     let unwrap = v => {
//         return v[__.$$native]
//     }
//     const j = (arg.lastIndexOf('<') + 1) / 6
//     for (let k = 0; k < j; ++k) {
//         const prevUnwrap = unwrap
//         unwrap = v => {
//             v = v.map(prevUnwrap)
//         }
//     }
//     return unwrap
// }

// function ArgWrap(arg: string) {
//     if (arg.indexOf('*') === -1) {
//         return
//     }
//     let wrap = v => {
//         const key = v.pointer()
//         return nativeWraps[key]
//     }
//     const j = (arg.lastIndexOf('<') + 1) / 6
//     for (let k = 0; k < j; ++k) {
//         const prevWrap = wrap
//         wrap = v => {
//             v = v.map(prevWrap)
//         }
//     }
//     return wrap
// }

// function apply(name: string, prototype: any, props: any, methods: any) {
//     for (let i = 0; i < props.length; i++) {
//         const prop = props[i]
//         if (prop.type.indexOf('<') !== -1) {
//             const length = native[`${name}_array_length_${prop.key}`]
//             const get = native[`${name}_array_get_${prop.key}`]
//             const set = native[`${name}_array_set_${prop.key}`]
//             const add = native[`${name}_array_add_${prop.key}`]
//             const remove = native[`${name}_array_remove_${prop.key}`]
//             const clear = native[`${name}_array_clear_${prop.key}`]

//             const baseType = prop.type.slice(prop.type.lastIndexOf('<') + 1, prop.type.indexOf('>'))

//             const key = Symbol(prop.key)
//             if (baseType.indexOf('*') !== -1) {
//                 const wrap = ArgWrap(baseType)
//                 const unwrap = ArgUnwrap(baseType)
//                 Object.defineProperty(prototype, prop.key, {
//                     get() {
//                         const native = this[__.$$native]
//                         const self = this
//                         this[key] = this[key] || {
//                             get length() {
//                                 return length(native)
//                             },
//                             get items() {
//                                 const items = []
//                                 const len = length(native)
//                                 for (let i = 0; i < len; i++) {
//                                     const item = wrap(get(native, i))
//                                     items.push(item)
//                                 }
//                                 return items
//                             },
//                             get(idx: number) {
//                                 return wrap(get(native, idx))
//                             },
//                             add(v) {
//                                 __.state.relations.push(() => {
//                                     v[__.$$attachAliveProp]([
//                                         self,
//                                         () => {
//                                             remove(native, unwrap(v))
//                                         },
//                                     ])
//                                     add(native, unwrap(v))
//                                 })
//                             },
//                             forceAdd(v) {
//                                 v[__.$$attachAliveProp]([
//                                     self,
//                                     () => {
//                                         remove(native, unwrap(v))
//                                     },
//                                 ])
//                                 add(native, unwrap(v))
//                             },
//                             remove(v) {
//                                 __.state.relations.push(() => {
//                                     v[__.$$detachAliveProp](self)
//                                     remove(native, unwrap(v))
//                                 })
//                             },
//                             forceRemove(v) {
//                                 v[__.$$detachAliveProp](self)
//                                 remove(native, unwrap(v))
//                             },
//                             clear() {
//                                 __.state.relations.push(() => {
//                                     const len = length(native)
//                                     for (let i = 0; i < len; i++) {
//                                         const life = wrap(get(native, i))
//                                         life[__.$$detachAliveProp](self)
//                                     }
//                                     clear(native)
//                                 })
//                             },
//                         }
//                         return this[key]
//                     },
//                 })
//             } else {
//                 Object.defineProperty(prototype, prop.key, {
//                     get() {
//                         const native = this[__.$$native]
//                         this[key] = this[key] || {
//                             get length() {
//                                 return length(native)
//                             },
//                             get items() {
//                                 const items = []
//                                 const len = length(native)
//                                 for (let i = 0; i < len; i++) {
//                                     const item = get(native, i)
//                                     items.push(item)
//                                 }
//                                 return items
//                             },
//                             get(idx: number) {
//                                 return get(native, idx)
//                             },
//                             set(idx: number, v) {
//                                 set(native, idx, v)
//                             },
//                             add(v) {
//                                 add(native, v)
//                             },
//                             forceAdd(v) {
//                                 add(native, v)
//                             },
//                             remove(v) {
//                                 remove(native, v)
//                             },
//                             forceRemove(v) {
//                                 remove(native, v)
//                             },
//                             clear() {
//                                 clear(native)
//                             },
//                         }
//                         return this[key]
//                     },
//                 })
//             }
//         } else {
//             const get = native[`${name}_get_${prop.key}`]
//             const set = native[`${name}_set_${prop.key}`]
//             if (prop.type.indexOf('*') !== -1) {
//                 const key = Symbol(prop.key)
//                 Object.defineProperty(prototype, prop.key, {
//                     get() {
//                         return this[key]
//                     },
//                     set(object) {
//                         const current = this[key]
//                         if (current) {
//                             current[__.$$detachAliveProp](this)
//                             this[key] = null
//                         }
//                         if (object != null) {
//                             object[__.$$attachAliveProp]([
//                                 this,
//                                 () => {
//                                     this[key] = null
//                                     set(this[__.$$native], null)
//                                 },
//                             ])
//                             this[key] = object
//                             set(this[__.$$native], object[__.$$native])
//                         }
//                     },
//                 })
//             } else {
//                 Object.defineProperty(prototype, prop.key, {
//                     get: function () {
//                         return get(this[__.$$native])
//                     },
//                     set: function (v) {
//                         return set(this[__.$$native], v)
//                     },
//                     enumerable: true,
//                     configurable: true,
//                 })
//             }
//         }
//     }

//     for (let i = 0; i < methods.length; i++) {
//         const method = methods[i]
//         const fn = native[`${name}_${method.key}`]
//         const unwraps = []
//         for (let i = 0; i < method.args.length; ++i) {
//             const unwrap = ArgUnwrap(method.args[i])
//             if (unwrap != null) {
//                 unwraps.push(args => {
//                     args[i] = unwrap(args[i])
//                 })
//             }
//         }

//         const returnWrap = ArgWrap(method.returnType)
//         if (returnWrap) {
//             if (unwraps.length > 0) {
//                 prototype[method.key] = function (...args) {
//                     unwrapArgs(args, unwraps)
//                     return returnWrap(fn(this[__.$$native], ...args))
//                 }
//             } else {
//                 prototype[method.key] = function (...args) {
//                     return returnWrap(fn(this[__.$$native], ...args))
//                 }
//             }
//         } else {
//             if (unwraps.length > 0) {
//                 prototype[method.key] = function (...args) {
//                     unwrapArgs(args, unwraps)
//                     return fn(this[__.$$native], ...args)
//                 }
//             } else {
//                 prototype[method.key] = function (...args) {
//                     return fn(this[__.$$native], ...args)
//                 }
//             }
//         }
//     }
// }
