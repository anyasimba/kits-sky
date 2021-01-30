import * as __ from './_'

export class CircleOfLife {
    [__.$$links]: number = 0;
    [__.$$detachList]: __.Detach[] = [];
    [__.$$host]: Live = null;
    [__.$$lifes]: CircleOfLife[] = [];
    [__.$$attachAliveProp](detach: __.Detach) {
        const alive = detach[0] as __.Alive
        alive[__.$$lifes].push(this)
        __.attach(this, detach)
    }

    [__.$$detachAliveProp](host: object) {
        const lifes = host[__.$$lifes]
        lifes.splice(lifes.indexOf(this), 1)
        __.detach(this, host)
    }

    [__.$$attachAlive](detach: __.Detach) {
        __.attach(this, detach)
    }

    [__.$$detachAlive](host: Live) {
        __.detach(this, host)
    }

    constructor() {
        __.state.lifesPurgatory.push(this)
    }

    protected detach() {
        __.detachFromAll(this)
    }

    destroy() {
        this[__.$$dead] = true
        if (this instanceof Native) {
            this.dead = true
        }
        __.state.lifesDeads.push(this)
    }
}
