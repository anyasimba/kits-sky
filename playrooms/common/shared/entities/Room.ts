import { ActionMode } from 'sky/common/HakunaMatata/@'
import { Player } from './Player'

export type Room = IHakunaMatata & {
    HasPlayer(player: Player): Relation
    notify(sourcePlayer: Player, params: { [key: string]: any })
}
export const Room = HakunaMatata(() => {
    const self: Room = Self(HakunaMatata, () => ({
        HasPlayer,
        notify,
    }))

    const players: Player[] = []

    const HasPlayer = asRelation((player: Player) => {
        players.push(player)
        return () => {
            players.splice(players.indexOf(player), 1)
        }
    })

    const notify = (sourcePlayer: Player, params: { [key: string]: any }) => {
        players.forEach(player => player.notify(sourcePlayer, { ...params, count: players.length }))
    }

    return self
})
