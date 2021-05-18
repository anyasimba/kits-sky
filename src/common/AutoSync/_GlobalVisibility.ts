import { Visibility } from './_Visibility'

export class GlobalVisibility extends Visibility {
    private __observers: Observer[] = []
    private __entities: any[] = []

    protected _getEntitiesForObserver(observer: Observer) {
        return this.__entities
    }

    protected _getObserversForEntity(entity: any) {
        return this.__observers
    }

    addObserver(observer: Observer) {
        super._addObserver(observer)
        this.__observers.push(observer)
        return observer
    }

    removeObserver(observer: Observer) {
        const idx = this.__observers.indexOf(observer)
        if (idx === -1) {
            throw new Error('observer not found')
        }
        this.__observers.splice(idx, 1)
    }

    addEntity(entity: any) {
        super._addEntity(entity)
        this.__entities.push(entity)
        return entity
    }

    removeEntity(entity: any) {
        const idx = this.__entities.indexOf(entity)
        if (idx === -1) {
            throw new Error('entity not found')
        }
        this.__entities.splice(idx, 1)
    }
}
