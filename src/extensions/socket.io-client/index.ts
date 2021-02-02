import * as _ from './socket.io-client'
globalify(_)

declare global {
    const io: typeof _.io
}
