import { HakunaMatata } from '../HakunaMatata/_HakunaMatata'

export enum AutoSyncUpdateType {
    SET,
    CREATE,
    DESTROY,
}

export class Watcher extends HakunaMatata {
    private __forDestroy = new Set<any>()
    private __forCreate = new Set<any>()

    constructor(acceptor: (update: any) => void) {
        super()

        this.onDestroy(() => {
            //
        })
    }

    private __acceptSet(propIdx: number, value: any) {
        const meta = watch.meta(this.constructor)
        console.log('accept set', meta[propIdx], value)
    }
    private __acceptCreate(classId: number, state: any) {}
    private __acceptDestroy(objId: number) {}
    private __acceptChange(objId: number, classId: number, propIdx: number, value: any) {}
}
