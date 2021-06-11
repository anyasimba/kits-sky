import { $$native, ArgUnwrap, ArgWrap, unwrapArgs } from './__'

declare const global: any

export function applyMethod(name: string, prototype: any, method: any) {
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
