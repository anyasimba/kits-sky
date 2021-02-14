type WatchNotAFunction = { [k: string]: unknown } & ({ bind?: never } | { call?: never })
export function Watch<T extends WatchNotAFunction>(fn: () => T): T {
    return fn()
}
