/* eslint-disable no-console */
import 'sky/common'

@shared('Entity')
class Entity extends Shared {
    @share('vec2')
    pos = this.new(vec2, { x: 19, y: 42 })
}

@shared('Box')
class Box extends Shared {
    @share('string')
    title = 'Box'

    @share('Entity')
    entity = this.new(Entity)
}

@shared('Game')
class Game extends Shared {
    @share('Box')
    box = this.new(Box)

    @share('Player[]')
    players = new array<Player>()
}

@shared('Player')
class Player extends Watcher {
    client = new AutoSync()

    @watch('Game')
    game = game

    @share('string')
    @access(function (this: Player, watcher) {
        return watcher === this || this.visible
    })
    title = ''

    @listen
    visible = false

    constructor() {
        super(update => this.client.accept(update))

        this.game.players.add(this)
    }

    setTitle(title: string) {
        this.title = title
        this.game.box.title = title
    }

    setVisibility(visible: boolean) {
        this.visible = visible
    }
}

const game = share.new(Game)

const player1 = share.new(Player)
player1.setTitle('PLAYER 1')
player1.setVisibility(false)

const player2 = share.new(Player)
player2.setTitle('PLAYER 2')

game.box.entity.pos.x = 42
game.box.entity.pos = new vec2({ x: 42, y: 19 })
