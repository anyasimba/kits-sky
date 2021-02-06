import { Room } from './Room'

let id_ = 0

type PlayerProps = {
    socket?: Io.ServerSocket
    room?: Room
}
export type Player = IHakunaMatata & {
    readonly id: number
    readonly x: number
    life: number
    room: Room | null
    move(): void
    fire(player: Player): void
    notify(player: Player, params: { [key: string]: any })
}
export const Player = HakunaMatata((props: PlayerProps = {}) => {
    const self: Player = Self(HakunaMatata, () => ({
        get id() {
            return id
        },
        get x() {
            return x
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

    const dynamic = Dynamic(() => ({
        get x() {
            return x
        },
        set x(value) {
            x = value
        },
    }))

    const id = id_++
    let x = useShared(() => 0, 'x')
    let life = 100

    const [getSocket] = useRelation<Io.ServerSocket>(props.socket, socket => {
        // TODO let relations after construct
        self.setEffect(EventListener(socket, 'move', () => move()))
        self.setEffect(EventListener(socket, 'disconnect', () => self.destroy('socket')))
    })
    const [getRoom, setRoom] = useRelation<Room>(props.room, room => {
        room.add(self)
        self.setRelation(room.HasPlayer(self))
    })
    // eslint-disable-next-line no-console
    console.log('Player')

    useEffect(() => {
        return (by: string) => {
            if (by !== 'socket') {
                const room = getRoom()
                const socket = getSocket()
                if (room && socket) {
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
        // ++dynamic.x
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
        getSocket()?.emit('notify', player.id, params)
    }

    return self
})
