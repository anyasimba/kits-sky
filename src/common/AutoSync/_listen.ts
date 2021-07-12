export type listen = typeof listen
export function listen(prototype: any, key: string | symbol) {
    const listenMeta: any = (prototype.___listenMeta = prototype.___listenMeta || {})
    listenMeta[key] = {}
}
