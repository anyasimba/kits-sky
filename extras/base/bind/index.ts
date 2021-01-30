import * as _ from './bind'
globally(_)

declare global {
    type bind = _.bind
    function bind<T extends Function>(
        target: object,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<T>
    ): TypedPropertyDescriptor<T> | void
}
