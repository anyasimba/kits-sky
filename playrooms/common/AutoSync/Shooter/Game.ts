import { Player } from './Player'
import { Location } from './entities/Location'

export class Game {
    location = new Location()

    addPlayer(listeners: ((update: any) => void)[]) {
        const player = new Player()
        this.location.addPlayer(player)
        return player
    }
}
