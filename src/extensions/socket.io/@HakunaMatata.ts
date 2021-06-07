import 'sky/common/HakunaMatata'

declare global {
    const withIoServerSockets: typeof _.withIoServerSockets
}

namespace _ {
    export const withIoServerSocket = withScope((scope, socket: Io.ServerSocket, io: Io.Server) => {
        socket.on('disconnect', scope.destroy)
    })

    export function withIoServerSockets(
        io: Io.Server,
        cb: (scope: HakunaMatata, socket: Io.ServerSocket, io: Io.Server) => void
    ) {
        io.on('connect', (socket: Io.ServerSocket) => {
            withIoServerSocket(socket, io, cb)
        })

        return io
    }
}

globalify(_)
