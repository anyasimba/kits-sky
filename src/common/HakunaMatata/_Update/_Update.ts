import { routeUpdatesRef } from './_routeUpdates'

export type Update = {}
export type UpdateProps<T extends any[]> = {
    deps: T
    type: string
    mode: ActionMode
    [key: string]: unknown
}
export const Update = <T extends any[]>({ type, mode }: UpdateProps<T>) => {
    if (!routeUpdatesRef.routeUpdates) {
        return
    }
    routeUpdatesRef.routeUpdates({})
}
