import * as _ from './socket.io-client'
globalify(_)

declare global {
    namespace Io {
        type ClientSocket = _.Socket
        type ClientSocketOptions = _.SocketOptions
    }
    const io: typeof _.io
}
