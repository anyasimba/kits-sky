import 'sky/extensions/react'
import 'sky/extensions/socket.io-client'
import 'sky/extensions/socket.io-client/@HakunaMatata'
import 'sky/common/HakunaMatata'

import { ViewMap } from './ViewMap'

const socket = io('ws://localhost')

const Connected = withIoClientSocket(socket, withConnected => {
    withConnected.addEffect(UpdateApp())

    socket.on('notify', (update: Update) => (playerID, params) => {
        // eslint-disable-next-line no-console
        console.log(playerID, params)
    })

    socket.on('update', (update: Update) => accept(update, ViewMap))
})

const App = () => {
    const [, updateState] = React.useState<object>()
    useEffect(() => {
        forceUpdate = () => updateState({})
        return () => (forceUpdate = null)
    })

    return (
        <>
            <div>{Connected() && 'Connected'}</div>
            <div>{Connected() && <button onClick={() => socket.emit('move')}>Move</button>}</div>
        </>
    )
}

let forceUpdate: (() => void) | null = null
const UpdateApp = asEffect(() => {
    forceUpdate && forceUpdate()
    return () => forceUpdate && forceUpdate()
})

ReactDOM.render(<App />, document.getElementById('root'))
