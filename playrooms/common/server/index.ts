import 'sky/standard/base'
import 'sky/extensions/socket.io'
import 'sky/extensions/socket.io/@HakunaMatata'
import 'sky/common/HakunaMatata'
import 'sky/common/effects'

import { Player } from '../shared/entities/Player'
import { Room } from '../shared/entities/Room'

const io = new Io.Server(80, { cors: { origin: '*' } })

routeUpdates(update => {
    console.log(update)
})

const room = Room()

withIoServerSockets(io, (withConnected, socket) => {
    // eslint-disable-next-line no-console
    console.log('client connected')
    withConnected.add(Player({ socket, room }))
})
