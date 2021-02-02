// production
declare const global
export type globalify = typeof globalify
export function globalify(module: object, target: object | string = global) {
    if (typeof target === 'string') {
        target = global[target] = global[target] || {}
    }
    Object.assign(target, module)
}
