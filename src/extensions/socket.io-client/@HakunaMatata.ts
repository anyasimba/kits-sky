import { connected } from 'process'
import 'sky/common/HakunaMatata'

declare global {
    const withIoClientSocket: typeof Global.withIoClientSocket
}

namespace Global {
    export function withIoClientSocket(
        socket: Io.ClientSocket,
        cb: (scope: IHakunaMatata, socket: Io.ClientSocket) => void
    ) {
        const withSocket = withScope((scope, socket: Io.ClientSocket) => {})

        let Connected: () => IHakunaMatata | null
        socket.on('connect', () => {
            Connected = withSocket(socket, cb)
        })
        socket.on('disconnect', () => Connected()!.destroy())
        return () => (Connected ? Connected() : null)
    }
}

globalify(Global)
