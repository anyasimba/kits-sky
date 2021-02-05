export function asEffect<T extends any[]>(effect: (...args: T) => () => void) {
    return Effect((...args: T) => {
        const self = Self(Effect, () => ({}))

        useEffect(() => {
            const destructor = effect(...args)
            return () => destructor()
        })

        return self
    })
}
