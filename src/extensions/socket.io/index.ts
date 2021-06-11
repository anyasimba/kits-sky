import * as _ from './&'
globalify(_)

declare global {
    namespace Io {
        type Server = _.Io.Server
        type Namespace = _.Io.Namespace
        type ServerSocket = _.Io.Socket
    }
    const Io: typeof _.Io
}
