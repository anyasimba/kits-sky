import { IEffect } from './_Effect'

export const effectsRef: { effects: (IEffect | (() => (() => void) | void))[] } = { effects: [] }
export function useEffect(effect: IEffect | (() => (() => void) | void)) {
    effectsRef.effects.push(effect)
}
