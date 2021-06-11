declare const global: any

export const $$native = Symbol('native')
export const $$nativeConstructor = Symbol('nativeConstructor')

export const classes: any = {}
export const props: any[] = []
export const methods: any[] = []

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
    let wrap = (v: any) => {
        const key = pointer(v)
        if (key === 0) {
            return null
        }
        if (wraps[key] == null) {
            const j = (arg.lastIndexOf('<') + 1) / 6
            const className = arg.slice(j * 6, -j - 1)
            console.log('className', className)
            const result = {
                [$$native]: v,
            }
            Object.setPrototypeOf(result, classes[className].prototype)
            return result
        }
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
