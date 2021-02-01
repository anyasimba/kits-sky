import { purgatoryRef } from './_purgatory'

export const $$lives = Symbol('lives')
export const $$links = Symbol('links')
export const $$dead = Symbol('dead')
export const $$detach = Symbol('detach')
export const $$destructors = Symbol('destructor')

export class Effect {
    [$$links] = 0;
    [$$detach]: [typeof HakunaMatata, () => void][] = [];
    [$$destructors]: (() => void)[] = []

    constructor() {
        // purgatoryRef.value.push(this)
    }
}
