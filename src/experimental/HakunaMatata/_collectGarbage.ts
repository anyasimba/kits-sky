import * as __ from './_'

export const $$dead = Symbol('dead')

export const state: {
    relations: (() => void)[]
    lifesPurgatory: CircleOfLife[]
    livesPurgatory: Live[]
    lifesDeads: CircleOfLife[]
    livesDeads: Live[]
} = {
    relations: [],
    lifesPurgatory: [],
    livesPurgatory: [],
    lifesDeads: [],
    livesDeads: [],
}

export type collectGarbage = typeof collectGarbage
export function collectGarbage() {
    for (let i = 0; i < state.relations.length; ++i) {
        state.relations[i]()
    }
    state.relations = []

    while (
        state.lifesPurgatory.length > 0 ||
        state.livesPurgatory.length > 0 ||
        state.lifesDeads.length > 0 ||
        state.livesDeads.length > 0
    ) {
        const currentLifesPurgatory = state.lifesPurgatory
        state.lifesPurgatory = []
        for (let i = 0; i < currentLifesPurgatory.length; ++i) {
            const life = currentLifesPurgatory[i]
            if (life[__.$$dead]) {
                continue
            }
            life[__.$$dead] = true
            if (life instanceof Native) {
                life.dead = true
            }
            destroyLife(life)
        }

        const currentLivesPurgatory = state.livesPurgatory
        state.livesPurgatory = []
        for (let i = 0; i < currentLivesPurgatory.length; i++) {
            const live = currentLivesPurgatory[i]
            if (live[__.$$dead]) {
                continue
            }
            destroyLive(live)
        }

        const currentLifesDeads = state.lifesDeads
        state.lifesDeads = []
        for (let i = 0; i < currentLifesDeads.length; i++) {
            const life = currentLifesDeads[i]
            __.detachFromAll(life)
            destroyLife(life)
        }

        const currentLivesDeads = state.livesDeads
        state.livesDeads = []
        for (let i = 0; i < currentLivesDeads.length; ++i) {
            const live = currentLivesDeads[i]
            __.detachFromAll(live)
            destroyLive(live)
        }
    }
}

function destroyLife(life: CircleOfLife) {
    for (let i = 0; i < life[__.$$lifes].length; ++i) {
        const life_ = life[__.$$lifes][i]
        life_[__.$$detachAliveProp](life)
    }
    life[__.$$destructor]()
}

function destroyLive(live: Live) {
    if (live[__.$$relations]) {
        const values = Array.from(live[__.$$relations].values()) as [[Function]]
        for (const relations of values) {
            for (let i = 0; i < relations.length; i++) {
                relations[i]()
            }
        }
        delete live[__.$$relations]
    }

    for (let i = 0; i < live[__.$$alives].length; i++) {
        live[__.$$alives][i].destroy()
    }
    for (let i = 0; i < live[__.$$lives].length; i++) {
        live[__.$$lives][i].destroy()
    }
    for (let i = 0; i < live[__.$$lifes].length; ++i) {
        const life = live[__.$$lifes][i]
        life[__.$$detachAliveProp](live)
    }
}
