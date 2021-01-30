import * as __ from '../_'

export * from '../_'

export function attach(live: Live, detach: __.Detach) {
    if (++live[__.$$links] === 1) {
        __.state.livesPurgatory.splice(__.state.livesPurgatory.indexOf(live))
    }
    live[__.$$detachList].push(detach)
    return live
}

export function detach(live: Live, host: Live) {
    const detachList = live[__.$$detachList]

    for (let i = 0; i < detachList.length; i++) {
        const detach = detachList[i]
        if (detach[0] === host) {
            detachList.splice(i, 1)
            break
        }
    }

    if (--live[__.$$links] === 0) {
        __.state.livesPurgatory.push(live)
    }
}
