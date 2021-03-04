const sharedRef = []

export function Shared<T>(state: T) {
    const internal = Object.assign({}, state)
    const shared = {}

    Object.keys(state!).forEach(key => {
        Object.defineProperty(shared, key, {
            get: () => internal[key],
            set: value => {
                internal[key] = value
                // analize
            },
        })
    })

    return shared as T
}
