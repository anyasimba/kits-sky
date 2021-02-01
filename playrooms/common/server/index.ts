import 'sky/standard/base'
import 'sky/extensions/socket.io'
import 'sky/common/HakunaMatata'
import 'sky/common/effects'

import { Player } from './Player'
import { Room } from './Room'

const io = new Io.Server(80, { cors: { origin: '*' } })

io.on('connect', socket => {
    // eslint-disable-next-line no-console
    console.log('client connected')
    Player({ socket, room })
})

const room = Room()
