export function Shared<T>(initialState?: T) {
    // eslint-disable-next-line no-console
    console.log('i am shared')

    const shared = {}
    if (initialState) {
        Object.assign(shared, initialState)
    }

    return shared
}
