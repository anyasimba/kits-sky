type DynamicNotAFunction = { [k: string]: unknown } & ({ bind?: never } | { call?: never })
export function Dynamic<T extends DynamicNotAFunction>(fn: () => T): T {
    return fn()
}
