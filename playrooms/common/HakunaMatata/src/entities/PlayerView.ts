import { Player } from '../../shared/entities/Player'
import { ClassViewMap } from '../ClassViewMap'

export type PlayerView = {}
export const PlayerView = HakunaMatata(() => {
    const self = Self(Player, () => ({}))

    return self
})

ClassViewMap.set(Player, PlayerView)
