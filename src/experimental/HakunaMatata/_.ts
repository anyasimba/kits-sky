export * from './_Alive'
export * from './_collectGarbage'

export const $$destructor = Symbol('destructor')
export const $$lifes = Symbol('lifes')
export const $$lives = Symbol('lives')
export const $$alives = Symbol('alives')
export const $$host = Symbol('host')
export const $$links = Symbol('links')
export const $$attachAliveProp = Symbol('attachAliveProp')
export const $$detachAliveProp = Symbol('detachAliveProp')
export const $$attachAlive = Symbol('attachAlive')
export const $$detachAlive = Symbol('detachAlive')
export const $$detachList = Symbol('detachList')
export type Detach = [any, () => void]

export const $$relations = Symbol('relations')

export function detachFromAll(live: Live | CircleOfLife) {
    const detachList = live[$$detachList]
    for (let i = 0; i < detachList.length; i++) {
        const detach = detachList[i]
        detach[1]()
    }
}
