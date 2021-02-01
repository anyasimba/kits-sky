import './experimental'
import { Player } from './Player'
export type Room = {
    addPlayer(player: Player)
    removePlayer(player: Player)
    notify(sourcePlayer: Player, params: { [key: string]: any })
}
export const Room = HakunaMatata(() => {
    const self = Self(HakunaMatata, () => ({
        addPlayer,
        removePlayer,
        notify,
    }))

    const players: Player[] = []

    const addPlayer = (player: Player) => {
        players.push(player)
    }

    const removePlayer = (player: Player) => {
        players.splice(players.indexOf(player))
    }

    const notify = (sourcePlayer: Player, params: { [key: string]: any }) => {
        players.forEach(player => player.notify(sourcePlayer, params))
    }

    return self
})
