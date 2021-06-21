import 'sky/common'
import 'sky/extensions/mobx'

class Boo extends HakunaMatata {
    x = 19
}

class Foo extends HakunaMatata {
    @link boo = new Boo()
}

const foo = new Foo()
console.log(Foo.prototype)

mobx.makeObservable(foo, {
    boo: mobx.computed,
})

mobx.autorun(() => {
    console.log('run', ...toLog(foo))
})

mobx.runInAction(() => {
    foo.boo = new Boo()
})
