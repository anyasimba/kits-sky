const $$lives = Symbol('lives')
const $$links = Symbol('links')
const $$dead = Symbol('dead')
const $$detach = Symbol('detach')
const $$destructors = Symbol('destructor')
let currentSelf

let purgatory: Live_[] = []
export function HakunaMatata() {
    purgatory.forEach(live => {
        live[$$dead] = true
        live[$$lives].forEach(live => live.destroy())
    })
    purgatory = []
}

type Live_ = InstanceType<typeof Live>
export const Live = class Live {
    [$$lives]: Live[] = [];
    [$$links] = 0;
    [$$detach]: [Live, () => void][] = [];
    [$$destructors]: (() => void)[] = []

    constructor() {
        purgatory.push(this)
    }

    get dead() {
        return this[$$dead] === true
    }

    add(live: Live) {
        if (live[$$links] === 0) {
            purgatory.splice(purgatory.indexOf(live))
        }
        ++live[$$links]
        live[$$detach].push([this, () => this[$$lives].splice(this[$$lives].indexOf(live))])
        this[$$lives].push(live)
    }

    remove(live: Live) {
        --live[$$links]
        if (live[$$links] === 0) {
            purgatory.push(this)
        }
        for (let i = 0; i < live[$$detach].length; ++i) {
            const detach = live[$$detach][i]
            if (detach[0] === this) {
                live[$$detach].splice(i, 1)
                break
            }
        }
        this[$$lives].splice(this[$$lives].indexOf(live))
    }

    destroy() {
        this[$$dead] = true
        this[$$destructors].forEach(destructor => destructor())
        this[$$detach].forEach(([live, fn]) => {
            if (!live.dead) {
                fn()
            }
        })
        this[$$lives].forEach(live => live.destroy())
    }
}

let effects = []
function useEffect(effect: () => (() => void) | void) {
    effects.push(effect)
}

export type Live<T extends (...args) => any> = ReturnType<T>

declare const global
type LivePropsType<T> = T extends (...args: infer P) => { prototype: any } ? P : any
type LiveReturnType<T> = T extends (...args: any[]) => { prototype: infer R } ? R : any
export function live<T extends (...args: any[]) => { new (): any; prototype: any }>(
    constructor: T
): (...args: LivePropsType<T>) => LiveReturnType<T> {
    return (...args: LivePropsType<T>) => {
        const savedUseEffect = global.useEffect
        global.useEffect = useEffect
        const liveInterface = constructor(...args)
        Object.setPrototypeOf(currentSelf, liveInterface.prototype)
        liveInterface.call(currentSelf)
        global.useEffect = savedUseEffect

        effects.forEach(effect => {
            const destructor = effect()
            if (destructor) {
                currentSelf[$$destructors].push(destructor)
            }
        })
        effects = []

        return currentSelf
    }
}

type SelfReturnType<T> = T extends (...args: any[]) => infer R ? R : any
export function Self<T extends (...args: any[]) => any>(constructor: T): SelfReturnType<T> {
    currentSelf = {}
    return currentSelf as any
}
