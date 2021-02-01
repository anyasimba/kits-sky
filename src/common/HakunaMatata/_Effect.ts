import { purgatoryRef } from './_purgatory'

export const $$links = Symbol('links')
export const $$detach = Symbol('detach')
export const $$destructors = Symbol('destructor')

export type IEffect = {}
export const Effect = function () {
    const self: IEffect = {} as any

    let links = 0
    const detach: [IEffect, () => void][] = []
    const destructors: (() => void)[] = []

    const purgatory = purgatoryRef.effectsPurgatory
    purgatory.push(self)

    Object.setPrototypeOf(self, {
        get [$$links]() {
            return links
        },
        set [$$links](value: number) {
            links = value
        },
        get [$$detach]() {
            return detach
        },
        get [$$destructors]() {
            return destructors
        },
    })
    return self
}
