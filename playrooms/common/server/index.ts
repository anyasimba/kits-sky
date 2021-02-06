import { Player, Room } from '../shared'
import 'sky/standard/base'
import 'sky/extensions/socket.io'
import 'sky/extensions/socket.io/@HakunaMatata'

const io = new Io.Server(80, { cors: { origin: '*' } })

const room = withHakunaMatata.add(Room())

routeUpdates(update => {
    // eslint-disable-next-line no-console
    console.log(update)
})

let clientsCount = 0
withIoServerSockets(io, (withConnected, socket) => {
    // eslint-disable-next-line no-console
    const log = () => console.log(`clients count: ${clientsCount}`)

    ++clientsCount
    log()

    withConnected.add(Player({ socket, room }))

    return () => {
        --clientsCount
        log()
    }
})
