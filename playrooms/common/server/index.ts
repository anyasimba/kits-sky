import 'sky/standard/base'
import 'sky/extensions/socket.io'
const server = http.createServer()
const io = Io(server, {
    cors: {
        origin: '*',
    },
})
io.on('connection', socket => {
    socket.on('test', (data, ...args) => {
        console.log(data, ...args)
    })
    socket.emit('hello', 1, 2, 3)
})

server.listen(80)
