import 'sky/common/EventEmitter'

export namespace AutoSync {
    export class Observer extends EventEmitter {
        private entities: any[] = []
    }
}
