import { Player } from './Player'
import { Location } from './Location'

export class Bullet {
    location: nullable<Location> = null
    creator: nullable<Player> = null
    @share pos: nullable<vec2> = null
    @share speed: nullable<vec2> = null

    update(dt: number) {
        if (this.pos == null || this.speed == null) {
            return
        }

        this.pos = this.pos.add(this.speed.multiply(dt))
    }
}
