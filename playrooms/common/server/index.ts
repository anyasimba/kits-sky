import 'sky/standard/base'
import 'sky/extensions/socket.io'
import 'sky/extensions/socket.io/@HakunaMatata'
import 'sky/common/HakunaMatata'
import 'sky/common/effects'

import { Player } from '../shared/entities/Player'
import { Room } from '../shared/entities/Room'

const io = new Io.Server(80, { cors: { origin: '*' } })

const room = withHakunaMatata.add(Room())

routeUpdates(update => {
    // eslint-disable-next-line no-console
    console.log(update)
})

withIoServerSockets(io, (withConnected, socket) => {
    // eslint-disable-next-line no-console
    console.log('client connected')
    withConnected.add(Player({ socket, room }))

    return () => {
        // eslint-disable-next-line no-console
        console.log('client disconnected')
    }
})
