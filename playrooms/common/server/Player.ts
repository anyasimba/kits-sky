import { Live, live, Self } from './experimental'
import { Room } from './Room'

let id_ = 0

interface PlayerProps {
    socket: Io.Socket
    room: Room
}
export type Player = Live<typeof Player>
export const Player = live((props: PlayerProps) => {
    const self = Self(Player)

    const { socket, room } = props

    const id = id_++
    let x = 0
    let life = 100

    useEffect(() => {
        socket.on('move', move)
        room.addPlayer(self)

        const onSocketDisconnect = () => room.removePlayer(self as Player)
        socket.on('disconnect', onSocketDisconnect)

        return () => {
            socket.off('move', move)
            socket.off('disconnect', onSocketDisconnect)
            setTimeout(() => {
                Player({ socket, room })
            }, 500)
        }
    })

    const move = () => {
        ++x
        room.notify(self, { x })
    }

    const fire = (player: Player) => {
        player.life -= 40
    }

    const setLife = value => {
        life = value

        if (life <= 0) {
            self.destroy()
        }
    }

    const notify = (player: Player, params: { [key: string]: any }) => {
        socket.emit('notify', player.id, params)
    }

    return class Player extends Live {
        get id() {
            return id
        }

        get life() {
            return life
        }
        set life(value) {
            setLife(value)
        }
        move = move
        fire = fire
        notify = notify
    }
})
