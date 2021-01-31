import * as _ from './socket.io-client'
globally(_)

declare global {
    const io: typeof _.io
}
