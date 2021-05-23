import 'sky/common/HakunaMatata'

const list = asRelation((array, object) => {
    array.push(object)
    return () => array.splice(array.indexOf(object), 1)
})

class Room extends HakunaMatata {
    foos: Foo[] = []
}

class Small extends Effect {
    param = 'small'
    constructor() {
        super()
        this.use(() => {
            console.log('small start')
            return () => console.log('small end')
        })
    }
}

class Foo extends HakunaMatata {
    @effect small = new Small()

    @relation<Room>(function (this: Foo, room) {
        setRelation(list(room.foos, this))
    })
    room: nullable<Room> = null

    constructor() {
        super()

        this.small = new Small()

        this.use(() => {
            console.log('foo created')
            return () => console.log('foo destroyed')
        })
    }
}

const foo = new Foo()
foo.room = new Room()
const getScope = withScope(scope => {})(scope => {})
getScope()?.add(foo)
getScope()?.add(foo.room)
console.log(foo.room.foos)
commit()
foo.destroy()
console.log(foo.room.foos)
commit()
