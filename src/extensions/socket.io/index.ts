import { Server } from 'http'
import * as _ from './socket.io'
globally(_)

declare global {
    interface Socket {
        on(event: string, callback: (...args: any[]) => void)
        on(event: 'connection', callback: (socket: Socket) => void)
        emit(event: string, ...args: any[])
        send(...args: any[])
    }

    const Io: {
        (server: Server, options: Partial<_.Io.ServerOptions>): Socket
    }
}
