import 'sky/common/EventEmitter'

export const __$$state = Symbol('state')

export class Observer extends EventEmitter {
    private [__$$state]: any[] = []
}
