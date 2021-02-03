import { Room } from './Room'

let id_ = 0

type PlayerProps = {
    socket: Io.Socket
    room: Room
}
export type Player = IHakunaMatata & {
    readonly id: number
    life: number
    room: Room | null
    move(): void
    fire(player: Player): void
    notify(player: Player, params: { [key: string]: any })
}
export const Player = HakunaMatata((props: PlayerProps) => {
    const self: Player = Self(HakunaMatata, () => ({
        get id() {
            return id
        },
        get life() {
            return life
        },
        set life(value) {
            setLife(value)
        },
        get room() {
            return getRoom()
        },
        set room(value) {
            setRoom(value)
        },
        move,
        fire,
        notify,
    }))

    const { socket } = props

    const id = id_++
    let x = 0
    let life = 100

    const [getRoom, setRoom] = useRelation<Room>(props.room, room => {
        room.add(self)
        self.setRelation(room.HasPlayer(self))
    })

    useEffect(() => {
        self.addEffect(EventListener(socket, 'move', move))
        self.addEffect(EventListener(socket, 'disconnect', () => self.destroy('socket')))

        return (by: string) => {
            if (by !== 'socket') {
                const room = getRoom()
                if (room) {
                    const recreatePlayerEffect = room.addEffect(
                        Timeout(() => Player({ socket, room }), 0.5)
                    )
                    room.addEffect(
                        EventListener(socket, 'disconnect', () => {
                            room.removeEffect(recreatePlayerEffect)
                        })
                    )
                }
            }
        }
    })

    const move = () => {
        ++x
        getRoom()?.notify(self, { x })
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

    return self
})
