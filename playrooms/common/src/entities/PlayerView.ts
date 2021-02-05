import { Player } from '../../shared/entities/Player'
import { ViewMap } from '../ViewMap'

export type PlayerView = {}
export const PlayerView = HakunaMatata(() => {
    const self = Self(Player, () => ({}))

    return self
})

ViewMap.set(Player, PlayerView)
