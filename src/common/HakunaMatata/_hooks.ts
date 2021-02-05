export const effectsRef: { effects: (() => (() => void) | void)[] } = { effects: [] }
export function useEffect(effect: () => (() => void) | void) {
    effectsRef.effects.push(effect)
}
