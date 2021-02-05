import 'sky/common/HakunaMatata'

declare global {
    const withIoServerSockets: typeof Global.withIoServerSockets
}

namespace Global {
    export const withIoServerSocket = withScope((scope, socket: Io.ServerSocket, io: Io.Server) => {
        socket.on('disconnect', scope.destroy)
    })

    export function withIoServerSockets(
        io: Io.Server,
        cb: (scope: IHakunaMatata, socket: Io.ServerSocket, io: Io.Server) => void
    ) {
        io.on('connect', (socket: Io.ServerSocket) => {
            withIoServerSocket(socket, io, cb)
        })

        return io
    }
}

globalify(Global)
