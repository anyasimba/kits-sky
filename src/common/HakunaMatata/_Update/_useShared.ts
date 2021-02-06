export function useShared<T>(getInitialValue: () => T, key: string) {
    return getInitialValue()
}
