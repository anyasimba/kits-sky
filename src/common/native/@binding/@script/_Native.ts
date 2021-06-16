import { native } from './_decorators'
import { $$native, $$nativeConstructor } from './__'

@native.class('Native')
export class Native extends HakunaMatata {
    @hidden private [$$native]: any
    constructor() {
        super()
        ;(this as any)[$$nativeConstructor].call(this)
    }
}
