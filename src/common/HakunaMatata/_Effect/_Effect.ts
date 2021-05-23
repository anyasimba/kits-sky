import { purgatoryRef } from '../_purgatoryRef'

export class Effect {
    private __links: HakunaMatata[] = []
    private __destructors: (() => void)[] = []
    private __disposed: optional<boolean>
    get disposed() {
        return this.__disposed === true
    }

    constructor() {
        const purgatory = purgatoryRef.effectsPurgatory
        purgatory.push(this)
    }

    protected detach() {
        this.__disposed = true
        this.__links.forEach(link => !link.disposed && (link as any).__removeEffect(this))
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

    private __attachTo(target: HakunaMatata) {
        if (this.__links.length === 0) {
            const purgatory = purgatoryRef.effectsPurgatory
            purgatory.splice(purgatory.indexOf(this), 1)
        }
        this.__links.push(target)
    }

    private __detachFrom(target: HakunaMatata) {
        this.__links.splice(this.__links.indexOf(target), 1)
        if (this.__links.length === 0) {
            const purgatory = purgatoryRef.effectsPurgatory
            purgatory.push(this)
        }
    }

    private __clear() {
        this.__disposed = true
        this.__destructors.forEach(destructor => destructor())
    }
}
