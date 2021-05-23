export type link = typeof link
export function link(prototype: any, key: string) {
    const $$destructor = Symbol(`${key} destructor`)
    let descriptor = Object.getOwnPropertyDescriptor(prototype, key)!
    if (descriptor == null) {
        descriptor = {}
    }
    if (descriptor.get == null) {
        const $$key = Symbol(key)
        descriptor.get = function (this: any) {
            return this[$$key]
        }
        descriptor.set = function (this: any, value: any) {
            if (!(value instanceof HakunaMatata)) {
                throw new Error('not instance of HakunaMatata')
            }
            if (this[$$key]) {
                this.remove(this[$$key])
                this[$$key].__destructors.splice(
                    this[$$key].__destructors.indexOf(this[$$destructor]),
                    1
                )
                delete this[$$destructor]
            }
            if (value) {
                this.add(value)
                this[$$destructor] = () => {
                    this[$$key] = null
                }
                ;(value as any).__destructors.push(this[$$destructor])
            }
            this[$$key] = value
        }
    } else {
        const get = descriptor.get!
        const set = descriptor.set!
        descriptor.get = function (this: any) {
            return get.call(this)
        }
        descriptor.set = function (this: any, value: any) {
            if (!(value instanceof HakunaMatata)) {
                throw new Error('not instance of HakunaMatata')
            }
            if (get.call(this)) {
                this.remove(get.call(this))
                get.call(this).__destructors.splice(
                    get.call(this).__destructors.indexOf(this[$$destructor]),
                    1
                )
                delete this[$$destructor]
            }
            if (value) {
                this.add(value)
                this[$$destructor] = () => set.call(this, null)
                ;(value as any).__destructors.push(this[$$destructor])
            }
            set.call(this, value)
        }
    }
    Object.defineProperty(prototype, key, descriptor)
}

export type effect = typeof effect
export function effect(prototype: any, key: string) {
    const $$destructor = Symbol(`${key} destructor`)
    let descriptor = Object.getOwnPropertyDescriptor(prototype, key)!
    if (descriptor == null) {
        descriptor = {}
    }
    if (descriptor.get == null) {
        const $$key = Symbol(key)
        descriptor.get = function (this: any) {
            return this[$$key]
        }
        descriptor.set = function (this: any, value: any) {
            if (!(value instanceof Effect)) {
                throw new Error('not instance of HakunaMatata')
            }
            if (this[$$key]) {
                this.removeEffect(this[$$key])
                this[$$key].__destructors.splice(
                    this[$$key].__destructors.indexOf(this[$$destructor]),
                    1
                )
                delete this[$$destructor]
            }
            if (value) {
                this.addEffect(value)
                this[$$destructor] = () => {
                    this[$$key] = null
                }
                ;(value as any).__destructors.push(this[$$destructor])
            }
            this[$$key] = value
        }
    } else {
        const get = descriptor.get!
        const set = descriptor.set!
        descriptor.get = function (this: any) {
            return get.call(this)
        }
        descriptor.set = function (this: any, value: any) {
            if (!(value instanceof Effect)) {
                throw new Error('not instance of HakunaMatata')
            }
            if (get.call(this)) {
                this.removeEffect(get.call(this))
                get.call(this).__destructors.splice(
                    get.call(this).__destructors.indexOf(this[$$destructor]),
                    1
                )
                delete this[$$destructor]
            }
            if (value) {
                this.addEffect(value)
                this[$$destructor] = () => set.call(this, null)
                ;(value as any).__destructors.push(this[$$destructor])
            }
            set.call(this, value)
        }
    }
    Object.defineProperty(prototype, key, descriptor)
}
