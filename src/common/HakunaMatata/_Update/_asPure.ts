export function asPure(deps: [], fn: () => {}) {
    return () => {
        fn()
    }
}
