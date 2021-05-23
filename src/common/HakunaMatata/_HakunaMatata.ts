import { purgatoryRef } from './_purgatoryRef'
import { Effect } from './_Effect/_Effect'
import { withScopeRef } from './_Scope/_withScopeRef'

export class HakunaMatata {
    private __hakunaMatatas: HakunaMatata[] = []
    private __effects: (Effect | (() => void))[] = []
    private __links: HakunaMatata[] = []
    private __relations: [HakunaMatata, () => void][] = []
    private __relationsLinks: [HakunaMatata, () => void][] = []
    private __destructors: ((...args: any[]) => void)[] = []
    private __disposed: optional<boolean>
    get disposed() {
        return this.__disposed === true
    }

    constructor() {
        if (!withScopeRef.on) {
            const purgatory = purgatoryRef.hakunaMatataPurgatory
            purgatory.push(this)
        }
    }

    add<T extends HakunaMatata>(hakunaMatata: T) {
        hakunaMatata.__attachTo(this)
        this.__hakunaMatatas.push(hakunaMatata)
        return hakunaMatata
    }

    remove(hakunaMatata: HakunaMatata) {
        hakunaMatata.__detachFrom(this)
        this.__remove(hakunaMatata)
    }

    addEffect<T extends Effect>(effect: T) {
        if (effect.disposed) {
            return
        }
        ;(effect as any).__attachTo(this)
        this.__effects.push(effect)
        return effect
    }

    removeEffect(effect: Effect) {
        ;(effect as any).__detachFrom(this)
        this.__removeEffect(effect)
    }

    destroy(...args: any[]) {
        this.__detachFromAll()
        this.__clear(...args)
    }

    use(effect: () => () => void) {
        const destructor = effect()
        if (destructor) {
            this.onDestroy(destructor)
        }
    }

    onDestroy(destructor: () => void) {
        this.__destructors.push(destructor)
    }

    private __remove(hakunaMatata: HakunaMatata) {
        this.__hakunaMatatas.splice(this.__hakunaMatatas.indexOf(hakunaMatata), 1)
    }

    private __removeEffect(effect: Effect) {
        this.__effects.splice(this.__effects.indexOf(effect), 1)
    }

    private __attachTo(target: HakunaMatata) {
        if (this.__links.length === 0) {
            const purgatory = purgatoryRef.hakunaMatataPurgatory
            purgatory.splice(purgatory.indexOf(this), 1)
        }
        this.__links.push(target)
    }

    private __detachFrom(target: HakunaMatata) {
        this.__links.splice(this.__links.indexOf(target), 1)
        if (this.__links.length === 0) {
            const purgatory = purgatoryRef.hakunaMatataPurgatory
            purgatory.push(this)
        }
    }

    private __clear(...args: any[]) {
        this.__disposed = true
        this.__hakunaMatatas.forEach(hakunaMatata => hakunaMatata.__detachFrom(this))

        // after
        this.__relationsLinks.forEach(([hakunaMatata, relation]) => relation())
        this.__effects.forEach(effect => (effect as any).__detachFrom(this))
        this.__relations.forEach(([subject, relations]) => relations())
        this.__destructors.forEach(destructor => destructor(...args))
    }

    private __detachFromAll() {
        this.__links.forEach(link => !link.disposed && link.__remove(this))
    }
}
