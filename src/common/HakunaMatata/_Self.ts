export const currentRef: { stack: any[] } = { stack: [] }

type SelfNotAFunction = { [k: string]: unknown } & ({ bind?: never } | { call?: never })
type SelfConstructor = () => SelfNotAFunction
type SelfConstructorResult<C> = C extends () => infer I ? I : never
type SelfParent = (() => SelfNotAFunction) | SelfNotAFunction
type SelfParentResult<T> = T extends () => infer I ? I : T extends SelfNotAFunction ? T : never
export function Self<T extends SelfParent, C extends SelfConstructor>(
    parent: T,
    getConstructor: C
): SelfConstructorResult<C> & SelfParentResult<T> {
    const current: any = { getConstructor }
    currentRef.stack.push(current)
    if (_.isFunction(parent)) {
        current.parent = (parent as any)()
    } else {
        current.parent = parent
    }
    return {} as any
}
