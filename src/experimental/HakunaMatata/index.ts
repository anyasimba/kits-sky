import * as _ from './HakunaMatata'
globally(_)

declare global {
    const HakunaMatata: typeof _.HakunaMatata

    type belongs = _.belongs
    function belongs<T>(prototype: T, propertyKey: string | symbol, descriptor: PropertyDescriptor)

    const link: typeof _.link

    type fireEvent = _.fireEvent
    const fireEvent: typeof _.fireEvent

    type alive = _.alive
    function alive<T>(prototype: T, propertyKey: string | symbol)
}
