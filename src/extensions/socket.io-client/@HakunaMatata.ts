import 'sky/common/HakunaMatata'

declare global {
    const withIoClientSocket: typeof Global.withIoClientSocket
}

namespace Global {
    export function withIoClientSocket(
        socket: Io.ClientSocket,
        cb: (scope: IHakunaMatata, socket: Io.ClientSocket) => void
    ) {
        let withConnected: IHakunaMatata | null = null

        const getConnected = FunctionEventEmitter(() => withConnected)

        const withSocket = withScope((scope, socket: Io.ClientSocket) => {})

        socket.on('connect', () => {
            withSocket(socket, scope => {
                withConnected = scope
                getConnected.emit('change')
                getConnected.emit('create')
                getConnected.emit('connect')
                return cb(scope, socket)
            })
        })
        socket.on('disconnect', () => {
            withConnected!.destroy()
            withConnected = null
            getConnected.emit('change')
            getConnected.emit('destroy')
            getConnected.emit('disconnect')
        })

        return getConnected
    }
}

globalify(Global)
