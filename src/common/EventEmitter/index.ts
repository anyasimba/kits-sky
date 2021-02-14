import * as _ from 'anyasimba.event-emitter'
globalify(_)

declare global {
    type EventEmitter = _.EventEmitter
    const EventEmitter: typeof _.EventEmitter

    const FunctionEventEmitter: typeof _.FunctionEventEmitter
}
