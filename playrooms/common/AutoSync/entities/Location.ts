import { Bullet } from './Bullet'
import { Player } from '../Player'

export class Location {
    players: Player[] = []
    bullets: Bullet[] = []
    autoSync = new AutoSync<GlobalVisibility>()

    @share w: number = 160
    @share h: number = 90

    constructor() {
        // this.autoSync.visibility = new GlobalVisibility()
    }

    update(dt: number) {
        this.bullets.forEach(bullet => bullet.update(dt))
    }

    addPlayer(player: Player) {
        this.players.push(player)
        player.location = this
        // this.autoSync.visibility!.addEntity(player)
        // this.autoSync.visibility!.addObserver(player)
    }

    addBullet(bullet: Bullet) {
        this.bullets.push(bullet)
        bullet.location = this
        // this.autoSync.visibility!.addEntity(bullet)
    }
}
