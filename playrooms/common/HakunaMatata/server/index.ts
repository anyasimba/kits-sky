import { Player, Room } from '../shared'
import 'sky/standard/standard-api'
import 'sky/extensions/socket.io'
import 'sky/extensions/socket.io/@HakunaMatata'

const io = new Io.Server(80, { cors: { origin: '*' } })

let clientsCount = 0
// eslint-disable-next-line no-console
const log = () => console.log(clientsCount)

const players: any[] = []

io.on('connect', (socket: Io.ServerSocket) => {
    ++clientsCount
    log()

    const player = {
        card: Math.random(),
    }
    const interval = setInterval(() => {
        player.card = Math.random()
    }, 100)
    players.push(player)

    socket.on('disconnect', () => {
        clearInterval(interval)
        players.splice(players.indexOf(player), 1)

        --clientsCount
        log()
    })
})
