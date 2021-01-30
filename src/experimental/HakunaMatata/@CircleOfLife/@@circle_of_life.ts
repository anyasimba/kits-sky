import * as __ from './_'

export type circle_of_life = typeof circle_of_life
export function circle_of_life<
    T extends {
        prototype: CircleOfLife & {
            destructor: () => void
        }
    }
>(constructor: T): T {
    const { prototype } = constructor

    prototype[__.$$destructor] = prototype.destructor
    delete prototype.destructor

    return constructor
}
