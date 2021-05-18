import { Player } from './entities/Player'
import { Location } from './entities/Location'

export class Game {
    location = new Location()

    addPlayer(listeners: ((update: any) => void)[]) {
        const player = new Player()
        listeners.forEach(listener => player.on('update', listener))
        this.location.addPlayer(player)
        return player
    }
}
