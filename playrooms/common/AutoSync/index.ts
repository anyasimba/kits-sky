import 'sky/common/AutoSync'
import 'sky/common/math'
import 'sky/common/shared'

const s = Symbol('ssss')

@shared
class Foo {
    @share('number') x = 19
    @share('number') y = 42
}

const foo = shared.new(Foo, (key, value) => {
    console.log('update', key, value)
})

foo.x = 42
