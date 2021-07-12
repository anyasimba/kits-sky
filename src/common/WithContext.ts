export {}

declare global {
    type WithContext = _.WithContext
    const WithContext: typeof _.WithContext
}

namespace _ {
    const $$context = Symbol('context')

    export type WithContext = typeof WithContext
    export function WithContext<T>(parent: any) {
        return class extends parent {
            context(this: any): T {
                return this[$$context]
            }
            call(this: any) {}
        }
    }
}

globalify(_)
