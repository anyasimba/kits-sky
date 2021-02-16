import 'sky/extensions/react'
import 'sky/extensions/socket.io-client'
import 'sky/extensions/socket.io-client/@HakunaMatata'
import 'sky/common/HakunaMatata'

import { ClassViewMap } from './ClassViewMap'

const socket = io('ws://localhost')

const Connected = withIoClientSocket(socket, () => {
    socket.on('notify', (playerID, params) => {
        // eslint-disable-next-line no-console
        console.log(playerID, params)
    })

    socket.on('update', (update: Update) => accept(update, ClassViewMap))

    // eslint-disable-next-line no-console
    console.log('socket connected')
    return () => {
        // eslint-disable-next-line no-console
        console.log('socket disconnected')
    }
})

type AppProps = {
    Connected: Scope
}
const App: React.FC<AppProps> = props => {
    const Connected = useScope(props.Connected)

    return (
        <>
            <div>{Connected() ? 'Connected' : 'Disconnected'}</div>
            <div>{Connected() && <button onClick={() => socket.emit('move')}>Move</button>}</div>
        </>
    )
}

ReactDOM.render(<App Connected={Connected} />, document.getElementById('root'))