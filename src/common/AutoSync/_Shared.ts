import { Visibility } from './_Visibility'

export function Shared<T>(visibility: Visibility, state: T) {
    const internal = Object.assign({}, state)
    const shared = {}

    Object.keys(state!).forEach(key => {
        Object.defineProperty(shared, key, {
            get: () => internal[key],
            set: value => {
                internal[key] = value
                visibility().forEach(listener => listener.accept({}))
            },
        })
    })

    return shared as T
}
