export const currentHakunaMatataRef = { stack: [] }

type NotAFunction = { [k: string]: unknown } & ({ bind?: never } | { call?: never })

export function Self<T extends (() => any) | NotAFunction, C extends () => { [key: string]: any }>(
    parent: T,
    getConstructor: C
): (C extends () => infer I ? I : never) &
    (T extends () => infer I ? I : T extends NotAFunction ? T : never) {
    const currentHakunaMatata: any = { getConstructor }
    currentHakunaMatataRef.stack.push(currentHakunaMatata)
    if (_.isFunction(parent)) {
        currentHakunaMatata.parent = (parent as any)()
    } else {
        currentHakunaMatata.parent = parent
    }
    return {} as any
}
