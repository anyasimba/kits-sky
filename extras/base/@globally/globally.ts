// production
declare const global
export type globally = typeof globally
export function globally(module: object, target: object | string = global) {
    if (typeof target === 'string') {
        target = global[target] = global[target] || {}
    }
    Object.assign(target, module)
}
