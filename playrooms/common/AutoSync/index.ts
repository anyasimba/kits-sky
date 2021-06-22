import 'sky/common/AutoSync'
import 'sky/common/math'

@shared
class Test extends Shared {
    x = 19
    y = this.new(vec2, { x: 19, y: 42 })
}

@shared
class A extends Shared {
    @share('string') title = 'A'
    @share('Test') test = this.new(Test)
}

@shared
class Foo extends Shared {
    @share('number') x = 19
    @share('number') y = 42
    @share('A') a = this.new(A)
    @share('ref') players: Player[] = []
}

const sync = new AutoSync()

const foo = sync.new(Foo)

foo.x = 42

class Player extends AutoSyncObserver {
    @share('Foo') foo = foo
    client = new AutoSync()

    constructor() {
        super()

        this.on('update', update => this.client.accept(update))
    }

    setTitle(title: string) {
        this.foo.a.title = title
    }
}
const player1 = new Player()
const player2 = new Player()

player1.setTitle('PLAYER 1')
player2.setTitle('PLAYER 2')

console.log(foo)
