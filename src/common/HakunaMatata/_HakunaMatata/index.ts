import * as _ from './@'
globalify(_)

declare global {
    type IHakunaMatata = _.IHakunaMatata
    const HakunaMatata: typeof _.HakunaMatata & typeof _.HakunaMatataClass
}
