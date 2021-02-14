import { Room } from './Room'

let id_ = 0

type PlayerProps = {
    socket?: Io.ServerSocket
    room?: Room
}
export type Player = IHakunaMatata & {
    readonly id: number
    readonly pos: vec2
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
        get pos() {
            return pos
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

    const watch = Watch(() => ({
        set pos(value) {
            pos = value
        },
    }))

    const dynamic = Dynamic(() => ({
        set pos(value) {
            pos = value
        },
        set life(value) {
            life = value
        },
    }))

    function visibility(ctx) {}

    const id = id_++
    let pos = useShared(() => new vec2({ x: 0, y: 0 }), 'pos')
    let life = useShared(() => 100, 'life')

    const [getSocket] = useRelation<Io.ServerSocket>(props.socket, socket => {
        self.setEffect(EventListener(socket, 'move', move))
        self.setEffect(EventListener(socket, 'disconnect', () => self.destroy('socket')))
    })
    const [getRoom, setRoom] = useRelation<Room>(props.room, room => {
        room.add(self)
        self.setRelation(room.HasPlayer(self))
    })
    // eslint-disable-next-line no-console
    console.log('Player')

    use(() => {
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
        ++pos.x
        dynamic.pos = pos
        watch.pos = pos
        getRoom()?.notify(self, { pos })
    }

    const fire = (player: Player) => {
        player.life -= 40
    }

    const setLife = value => {
        dynamic.life = value

        if (life <= 0) {
            self.destroy()
        }
    }

    const notify = (player: Player, params: { [key: string]: any }) => {
        getSocket()?.emit('notify', player.id, params)
    }

    return self
})
