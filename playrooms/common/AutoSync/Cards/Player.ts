import { Card } from './Card'

export class Player {
    private observer = new AutoSync.Observer()
    private cards: Card[] = []

    addCard(card: Card) {
        this.cards.push(card)
    }
}
