import * as _ from './socket.io'
globally(_)

declare global {
    namespace Io {
        type Server = _.Io.Server
        type Namespace = _.Io.Namespace
        type Socket = _.Io.Socket
    }
    const Io: typeof _.Io
}
