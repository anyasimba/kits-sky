import { purgatoryRef } from './_purgatoryRef'
import { withScopeRef } from './_Scope/_withScopeRef'
import './_AutoSync'

@shared
export class HakunaMatata extends EventEmitter {
    @hidden private __parents: [HakunaMatata, (() => void) | undefined][] = []
    @hidden private __childs: HakunaMatata[] = []
    @hidden private __relations: [HakunaMatata, () => void][] = []
    @hidden private __relationsChilds: [HakunaMatata, () => void][] = []
    @hidden private __destructors: ((...args: any[]) => void)[] = []
    @hidden private __destroyArgs: optional<any[]>
    @hidden private __disposed: optional<boolean>
    get disposed() {
        return this.__disposed === true
    }

    constructor() {
        super()

        if (!withScopeRef.on) {
            const purgatory = purgatoryRef.purgatory
            purgatory.push(this)
        }
    }

    addLink<T extends HakunaMatata>(hakunaMatata: T) {
        hakunaMatata.__attachTo(this)
        this.__childs.push(hakunaMatata)
        return hakunaMatata
    }

    removeLink(hakunaMatata: HakunaMatata) {
        hakunaMatata.__detachFrom(this)
        this.__remove(hakunaMatata)
    }

    destroy(...args: any[]) {
        this.__disposed = true
        this.__destroyArgs = args
        const purgatory = purgatoryRef.purgatory
        purgatory.push(this)
    }

    use(effect: (detach: () => void) => () => void) {
        const ref: any = {}
        const detach = () => {
            if (!ref.done) {
                ref.skip = true
                return
            }
            if (ref.destructor) {
                this.__destructors.splice(this.__destructors.indexOf(ref.destructor))
            }
        }
        ref.destructor = effect(detach)
        ref.done = true
        if (!ref.skip && ref.destructor) {
            this.onDestroy(ref.destructor)
        }
    }

    onDestroy(destructor: () => void) {
        this.__destructors.push(destructor)
    }

    private __remove(hakunaMatata: HakunaMatata) {
        this.__childs.splice(this.__childs.indexOf(hakunaMatata), 1)
    }

    private __attachTo(target: HakunaMatata, cb?: () => void) {
        if (this.__disposed) {
            throw new Error('disposed')
        }
        if (target.__disposed) {
            throw new Error('target disposed')
        }
        if (this.__parents.length === 0) {
            const purgatory = purgatoryRef.purgatory
            purgatory.splice(purgatory.indexOf(this), 1)
        }
        this.__parents.push([target, cb])
    }

    private __detachFrom(target: HakunaMatata) {
        for (let i = 0; i < this.__parents.length; ++i) {
            if (this.__parents[i][0] === target) {
                this.__parents.splice(i, 1)
                break
            }
        }
        if (this.__parents.length === 0) {
            const purgatory = purgatoryRef.purgatory
            purgatory.push(this)
        }
    }

    private __destroy() {
        this.__disposed = true
        this.__childs.forEach(hakunaMatata => hakunaMatata.__detachFrom(this))
        this.__parents.forEach(([parent, cb]) => {
            if (!parent.disposed) {
                parent.__remove(this)
                if (cb) {
                    cb()
                }
            }
        })
        this.__relationsChilds.forEach(([hakunaMatata, relation]) => relation())
        this.__relations.forEach(([subject, relation]) => relation())
        this.__destructors.forEach(destructor => destructor(...(this.__destroyArgs || [])))
    }
}
