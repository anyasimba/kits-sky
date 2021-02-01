import { purgatoryRef } from './_purgatory'

export const $$lives = Symbol('lives')
export const $$links = Symbol('links')
export const $$detach = Symbol('detach')
export const $$destructors = Symbol('destructor')
export const $$dead = Symbol('dead')

export type IHakunaMatata = {
    add(live: IHakunaMatata)
    remove(live: IHakunaMatata)
    destroy()
}
export const HakunaMatata = function () {
    const lives: IHakunaMatata[] = []
    let links = 0
    const detach: [IHakunaMatata, () => void][] = []
    const destructors: (() => void)[] = []
    let dead

    purgatoryRef.value.push(this)

    const add = (live: IHakunaMatata) => {
        if (live[$$links] === 0) {
            purgatoryRef.value.splice(purgatoryRef.value.indexOf(live))
        }
        ++live[$$links]
        live[$$detach].push([this, () => this[$$lives].splice(this[$$lives].indexOf(live))])
        this[$$lives].push(live)
    }

    const remove = (live: IHakunaMatata) => {
        --live[$$links]
        if (live[$$links] === 0) {
            purgatoryRef.value.push(this)
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

    const destroy = () => {
        dead = true
        this[$$destructors].forEach(destructor => destructor())
        this[$$detach].forEach(([live, fn]) => {
            if (!live.dead) {
                fn()
            }
        })
        this[$$lives].forEach(live => live.destroy())
    }

    return {
        get dead() {
            return dead === true
        },
        set [$$dead](value) {
            dead = value
        },
        add,
        remove,
        destroy,
        get [$$lives]() {
            return lives
        },
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
    }
}
