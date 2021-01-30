import { CircleOfLife } from './@@CircleOfLife'
import { circle_of_life } from './@@circle_of_life'
import * as __ from './_'

@circle_of_life
export class CircleOfLifes extends CircleOfLife {
    lifes: CircleOfLife[] = []

    destructor() {
        const { lifes } = this
        for (let i = 0; i < lifes.length; i++) {
            __.detach(lifes[i], this)
        }
    }

    add<T extends CircleOfLife>(life: T): T {
        __.state.relations.push(() => {
            if (this.lifes.indexOf(life) !== -1) {
                throw new Error('life already exists')
            }

            this.lifes.push(life)

            __.attach(life, [
                this,
                () => {
                    const { lifes } = this
                    lifes.splice(lifes.indexOf(life))
                },
            ])
        })

        return life
    }

    remove(life: CircleOfLife) {
        __.state.relations.push(() => {
            const idx = this.lifes.indexOf(life)
            if (idx === -1) {
                throw new Error('life not found')
            }

            this.lifes.splice(idx)

            __.detach(life, this)
        })
    }

    clear() {
        __.state.relations.push(() => {
            const { lifes } = this
            for (let i = 0; i < lifes.length; i++) {
                const life = lifes[i]
                __.detach(life, this)
            }
            this.lifes = []
        })
    }
}
