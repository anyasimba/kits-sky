import { HakunaMatata } from '../HakunaMatata/_HakunaMatata'

export class AutoSyncObserver extends HakunaMatata {
    constructor() {
        super()

        this.use(() => {
            return () => {}
        })
    }
}
