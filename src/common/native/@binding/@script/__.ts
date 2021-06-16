declare const global: any

export const $$native = Symbol('native')
export const $$nativeConstructor = Symbol('nativeConstructor')

export const classes: any = {}
export const currentState = {
    props: [] as any[],
    methods: [] as any[],
}

export const wraps: any = {}

export function pointer(native: any): number {
    if (global.___NATIVE.pointer) {
        return global.___NATIVE.pointer(native)
    }
    return native.pointer()
}

export function unwrapArgs(args: any[], unwraps: any[]) {
    for (let i = 0; i < unwraps.length; ++i) {
        unwraps[i](args)
    }
}

export function ArgUnwrap(arg: string) {
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

export function ArgWrap(arg: string) {
    if (arg.indexOf('*') === -1) {
        return
    }
    const shift1 = (arg.lastIndexOf('<') + 1) / 6
    const shift2 = arg.indexOf('[') !== -1 ? arg.indexOf(']') - arg.indexOf('[') : 0
    const className = arg.slice(shift1 * 6, -shift1 - 1 - shift2)
    let wrap = (v: any) => {
        const key = pointer(v)
        if (key === 0) {
            return null
        }
        if (wraps[key] == null) {
            const result = {
                [$$native]: v,
            }
            Object.setPrototypeOf(result, classes[className].prototype)
            return result
        }
        return wraps[key]
    }
    for (let k = 0; k < shift1 + shift2; ++k) {
        const prevWrap = wrap
        wrap = v => {
            v = v.map(prevWrap)
        }
    }
    return wrap
}
