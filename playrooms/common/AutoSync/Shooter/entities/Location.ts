import { Bullet } from './Bullet'
import { Player } from '../Player'

export class Location {
    players: Player[] = []
    bullets: Bullet[] = []

    @share('number')
    w: number = 160
    @share('number')
    h: number = 90

    constructor() {}

    update(dt: number) {
        this.bullets.forEach(bullet => bullet.update(dt))
    }

    addPlayer(player: Player) {
        this.players.push(player)
        player.location = this
    }

    addBullet(bullet: Bullet) {
        this.bullets.push(bullet)
        bullet.location = this
    }
}
