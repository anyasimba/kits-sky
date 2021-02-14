import 'sky/common/F'

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
            // eslint-disable-next-line no-console
            console.log('test2 base')
        },
    }))

    return self
})

const Boo = F(() => {
    let y = 19
    return Self(Foo, () => ({
        get y() {
            return y
        },
        set y(value) {
            y = value
        },
    }))
})

const Goo = F(() => {
    let z = 42
    return Self(Boo, () => ({
        get z() {
            return z
        },
        set z(value) {
            z = value
        },
        test2() {
            // eslint-disable-next-line no-console
            console.log('test2')
        },
    }))
})

const goo = Goo()
const goo2 = goo.test()
goo2.test2()
Foo().test2()

// eslint-disable-next-line no-console
console.log(goo.x, goo.y, goo.z)
