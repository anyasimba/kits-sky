import * as _ from './CircleOfLife'
globally(_)

declare global {
    type CircleOfLifes = _.CircleOfLifes
    const CircleOfLifes: typeof _.CircleOfLifes

    type circle_of_life = typeof _.circle_of_life
    function circle_of_life<
        T extends {
            prototype: CircleOfLife & {
                destructor: () => void
            }
        }
    >(constructor: T): T

    type CircleOfLife = _.CircleOfLife
    const CircleOfLife: typeof _.CircleOfLife
}
