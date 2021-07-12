import { $$id, $$watchs, classMap } from '../__'

let uniqClassId = 0

export type shared = typeof shared
export function shared(className: string) {
    return function (constructor: any) {
        constructor[$$id] = ++uniqClassId
        classMap[uniqClassId] = constructor
        classMap[className] = constructor
        Object.defineProperty(constructor.prototype, $$id, {
            configurable: false,
            enumerable: false,
            writable: true,
        })

        const sharedMeta: any = []
        getSharedMeta(constructor.prototype, sharedMeta)
        constructor.___sharedMeta = sharedMeta

        const watchMeta: any = []
        getWatchMeta(constructor.prototype, watchMeta)
        constructor.___watchMeta = watchMeta

        const meta = shared.meta(constructor)
        console.log('meta', meta)

        constructor.___addWatch = (obj: any, watcher: any, $$watchId: symbol) => {
            obj[$$watchs] = obj[$$watchs] || []

            let watchsCount = 0
            let isExists = false

            for (let i = 0; i < obj[$$watchs].length; ++i) {
                const watch = obj[$$watchs][i]
                if (watch[0] === watcher && watch[1] === $$watchId) {
                    ++watch[2]
                    ++watchsCount
                    isExists = true
                } else if (watch[0] === watcher) {
                    ++watchsCount
                }
            }

            if (!isExists) {
                obj[$$watchs].push([watcher, $$watchId, 0])
            }

            if (watchsCount === 0) {
                if (watcher.__forDestroy.has(obj)) {
                    watcher.__forDestroy.delete(obj)
                } else {
                    watcher.__forCreate.add(obj)
                }
            }

            // console.log('ADDED', obj, watcher, $$watchId)
        }

        constructor.removeWatch = (obj: any, watcher: any, $$watchId: symbol) => {
            let watchsCount = 0
            for (let i = 0; i < obj[$$watchs].length; ++i) {
                const watch = obj[$$watchs][i]
                if (watch[0] === watcher && watch[1] === $$watchId) {
                    if (watch[2] === 0) {
                        obj[$$watchs].splice(i, 1)
                    } else {
                        --watch[2]
                        ++watchsCount
                    }
                } else if (watch[0] === watcher) {
                    ++watchsCount
                }
            }

            if (obj[$$watchs].length === 0) {
                delete obj[$$watchs]
            }

            if (watchsCount === 0) {
                if (watcher.__forCreate.has(obj)) {
                    watcher.__forCreate.delete(obj)
                } else {
                    watcher.__forDestroy.add(obj)
                }
            }

            console.log(shared.meta(obj.constructor))
        }
    }
}

shared.meta = function (constructor: any): { key: string; type: string[] }[] {
    return constructor.___sharedMeta
}

function getSharedMeta(prototype: any, result: any) {
    const nextPrototype = Object.getPrototypeOf(prototype)
    if (nextPrototype) {
        getSharedMeta(nextPrototype, result)
    }

    if (prototype.___sharedMeta) {
        result.push(...prototype.___sharedMeta)
    }
}

function getWatchMeta(prototype: any, result: any) {
    const nextPrototype = Object.getPrototypeOf(prototype)
    if (nextPrototype) {
        getWatchMeta(nextPrototype, result)
    }

    if (prototype.___watchMeta) {
        result.push(...prototype.___watchMeta)
    }
}
