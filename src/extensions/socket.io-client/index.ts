import * as _ from './&'
globalify(_)

declare global {
    namespace Io {
        type ClientSocket = _.Socket
        type ClientSocketOptions = _.SocketOptions
    }
    const io: typeof _.io
}
