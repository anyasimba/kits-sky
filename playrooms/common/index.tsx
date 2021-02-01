import 'sky/extensions/react'
import 'sky/extensions/socket.io-client'
const socket = io('ws://localhost')

socket.on('connect', () => {
    // eslint-disable-next-line no-console
    console.log('connected')
})

socket.on('notify', (playerID, params) => {
    console.log(playerID, params)
})

const App = () => {
    return (
        <>
            <div>
                <button onClick={() => socket.emit('move')}>Move</button>
            </div>
        </>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
