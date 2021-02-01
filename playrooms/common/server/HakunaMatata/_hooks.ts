export const effectsRef: { value: (() => (() => void) | void)[] } = { value: [] }
export function useEffect(effect: () => (() => void) | void) {
    effectsRef.value.push(effect)
}
