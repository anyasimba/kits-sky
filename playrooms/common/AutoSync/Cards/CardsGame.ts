import { Card } from './Card'
import { Player } from './Player'
import { Suit } from './Suit'

export class CardsGame {
    private players: Player[] = []

    addPlayer(player: Player) {
        this.players.push(player)
    }

    initGame() {
        this.players.forEach(player => {
            player.addCard(new Card(1, Suit.BLACK))
        })
    }
}
