import 'sky/common/AutoSync'
import 'sky/common/math'
import { Game } from './Game'

const game = new Game()
const player = game.addPlayer([
    update => {
        console.log(update)
    },
])
player.move(new vec2({ x: 0, y: 1 }))
