import { __$$state } from './_Observer'
import { __$$prototype } from './_share/_share'

const $$id = Symbol('id')

export abstract class Visibility {
    __id = 0

    private encodeEntity(entity: any, observer: Observer) {
        return entity
    }

    private decodeEntity(entity: any) {
        return entity
    }

    protected _addObserver(observer: Observer) {
        const entities = this._getEntitiesForObserver(observer)
        observer[__$$state] = entities
        observer.emit('update', {
            state: entities.map(entity => this.encodeEntity(entity, observer)),
        })
    }
    protected _addEntity(entity: any) {
        Object.setPrototypeOf(entity, entity[__$$prototype])
        entity[$$id] = this.__id++

        const observers = this._getObserversForEntity(entity)
        observers.forEach(observer => {
            observer.emit('update', { new: this.encodeEntity(entity, observer) })
        })
    }

    protected abstract _getEntitiesForObserver(observer: Observer): any[]
    protected abstract _getObserversForEntity(entity: any): Observer[]

    resetObserver(observer: Observer) {
        this._addObserver(observer)
    }
}
