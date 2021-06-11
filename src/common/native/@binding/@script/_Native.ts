import { $$nativeConstructor } from './__'

@native.class('Native')
export class Native extends HakunaMatata {
    constructor() {
        super()
        ;(this as any)[$$nativeConstructor].call(this)
    }
}
