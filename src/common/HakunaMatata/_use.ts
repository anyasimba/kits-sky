export const useRef: { effects: (() => (() => void) | void)[] } = { effects: [] }
export function use(effect: () => (() => void) | void) {
    useRef.effects.push(effect)
}
