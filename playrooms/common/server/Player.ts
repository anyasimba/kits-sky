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

    const [getRoom, setRoom] = useRelation(props.room, room => {
        self.setRelation(room.hasPlayer(self))
    })

    useEffect(() => {
        self.addEffect(EventListener(socket, 'disconnect', () => self.destroy()))
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

type Foo = (a: number, b: number) => void
function test(foo: Foo) {}
test(() => {})
