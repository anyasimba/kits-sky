import 'sky/extensions/socket.io-client'
const socket = io('ws://localhost')

socket.on('connect', () => {
    socket.emit('test', 1, 2, 3)
})

socket.on('hello', (a, b, c) => {
    console.log(a + b + c)
})
