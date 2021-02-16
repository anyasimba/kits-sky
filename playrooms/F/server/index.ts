/* eslint-disable no-console */
import 'sky/common/F'

type Foo = typeof Foo
const Foo = F(() => {
    let x = 10

    const self = Self(() => ({
        get x() {
            return x
        },
        set x(value) {
            x = value
        },
        test() {
            return self
        },
        test2() {
            console.log('test2 base')
        },
        some() {
            console.log('some')
        },
    }))

    return self
})

type Boo = typeof Boo
const Boo = F(() => {
    let y = 19
    const self = Self(Foo, () => ({
        get y() {
            return y
        },
        set y(value) {
            y = value
        },
    }))
    return self
})

type Goo = typeof Goo
const Goo = F(() => {
    let z = 42
    const self = Self(Boo, () => ({
        get z() {
            return z
        },
        set z(value) {
            z = value
        },
        test2() {
            console.log('test2')
        },
    }))

    return self
})

Foo().test2()

const foo = Foo()
const boo = Boo()
const goo = Goo()
const goo2 = goo.test()
goo2.test2()
console.log(goo.x, goo.y, goo.z)
console.log(foo instanceof Goo, foo instanceof Boo, foo instanceof Foo)
console.log(boo instanceof Goo, boo instanceof Boo, boo instanceof Foo)
console.log(goo instanceof Goo, goo instanceof Boo, goo instanceof Foo)
