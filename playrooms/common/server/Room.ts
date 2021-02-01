import { Live, live, Self } from './experimental'
import { Player } from './Player'

export type Room = Live<typeof Room>
export const Room = live(() => {
    const self = Self(Room)

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

    return class Room extends Live {
        addPlayer = addPlayer
        removePlayer = removePlayer
        notify = notify
    }
})
