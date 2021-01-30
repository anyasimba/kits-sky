import * as __ from './_'

export class Live {
    [__.$$links]: number = 0;
    [__.$$detachList]: __.Detach[] = [];
    [__.$$host]: Live = null;
    [__.$$lifes]: CircleOfLife[] = [];
    [__.$$lives]: Live[] = [];
    [__.$$alives]: __.Alive[] = [];
    [__.$$attachAliveProp](detach: __.Detach) {
        const live = detach[0] as Live
        live[__.$$lives].push(this)
        __.attach(this, detach)
    }

    [__.$$detachAliveProp](host: Live) {
        const livesLinks = host[__.$$lives]
        livesLinks.splice(livesLinks.indexOf(this), 1)
        __.detach(this, host)
    }

    [__.$$attachAlive](detach: __.Detach) {
        __.attach(this, detach)
    }

    [__.$$detachAlive](host: Live) {
        __.detach(this, host)
    }

    constructor() {
        __.state.livesPurgatory.push(this)
    }

    fireEvent(name: string, ...args) {
        const alives = this[__.$$alives]
        for (let i = 0; i < alives.length; i++) {
            const alive = alives[i]
            fireEvent(alive, name, ...args)
        }
    }

    add<T extends __.Alive>(alive: T) {
        __.state.relations.push(() => {
            if (this[__.$$alives].indexOf(alive) !== -1) {
                throw new Error('alive already exists')
            }

            this[__.$$alives].push(alive)

            if (alive[__.$$host]) {
                alive[__.$$detachAlive](alive[__.$$host])
            }

            alive[__.$$attachAlive]([
                this,
                () => {
                    const alives = this[__.$$alives]
                    alives.splice(alives.indexOf(alive))
                },
            ])
        })

        return alive
    }

    remove(alive: __.Alive) {
        __.state.relations.push(() => {
            const idx = this[__.$$alives].indexOf(alive)
            if (idx === -1) {
                throw new Error('live not found')
            }

            this[__.$$alives].splice(idx, 1)

            alive[__.$$detachAlive](this)
        })
    }

    clear() {
        __.state.relations.push(() => {
            const alives = this[__.$$alives]
            for (let i = 0; i < alives.length; i++) {
                const alive = alives[i]
                alive[__.$$detachAlive](this)
            }
            this[__.$$alives] = []
        })
    }

    destroy() {
        this[__.$$dead] = true
        __.state.livesDeads.push(this)
    }
}
