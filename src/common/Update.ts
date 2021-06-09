declare global {
    type Update = _.Update
    const Update: typeof _.Update

    type withDt = _.withDt
    const withDt: typeof _.withDt
}

namespace _ {
    export class Update {
        private __time = Date.now()

        step() {
            const now = Date.now()
            const dt = (now - this.__time) * 0.001
            this.__time = now
            return dt
        }
    }

    export type withDt = typeof withDt
    export function withDt(cb: (dt: number) => void) {
        const update = new Update()
        return () => cb(update.step())
    }
}

globalify(_)
export {}
