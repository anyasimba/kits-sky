import * as __ from '../_'

export * from '../_'

export function attach(life: CircleOfLife, detach: __.Detach) {
    if (++life[__.$$links] === 1) {
        __.state.lifesPurgatory.splice(__.state.lifesPurgatory.indexOf(life), 1)
    }
    life[__.$$detachList].push(detach)
    return life
}

export function detach(life: CircleOfLife, host: object) {
    const detachList = life[__.$$detachList]

    for (let i = 0; i < detachList.length; i++) {
        const detach = detachList[i]
        if (detach[0] === host) {
            detachList.splice(i, 1)
            break
        }
    }

    if (--life[__.$$links] === 0) {
        __.state.lifesPurgatory.push(life)
    }
}
