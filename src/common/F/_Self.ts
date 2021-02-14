export const selfRef: { self?: any; stack: any[] } = { stack: [] }

type NotAFunction = { [k: string]: unknown } & ({ bind?: never } | { call?: never })
type Constructor = () => NotAFunction
type ConstructorResult<C> = C extends () => infer I ? I : never
type Parent = (() => NotAFunction) | NotAFunction
type ParentResult<T> = T extends () => infer I ? I : T extends NotAFunction ? T : never
export function Self<T extends Parent, C extends Constructor, C2 extends Constructor>(
    parent: C2 | T,
    getConstructor?: C
): ConstructorResult<C> & ParentResult<T> {
    if (arguments.length === 1) {
        getConstructor = parent as any
        parent = undefined as any
    }

    const current: any = _.last(selfRef.stack)
    current.getConstructor = getConstructor

    if (parent) {
        if (_.isFunction(parent)) {
            parent = (parent as any)()
        }
        current.parent = parent
    }
    return selfRef.self
}
