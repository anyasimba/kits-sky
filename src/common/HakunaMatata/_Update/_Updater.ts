import { updateRef } from './_updateRef'

const $$commit = Symbol('update')
export const __updaterCommit = (self: IUpdater) => self[$$commit]()

export type IUpdater = {
    accept(update: Update): void
}
export function Updater(commit: (updates: Update[]) => void) {
    let updates: Update[] = []

    const accept = (update: Update) => updates.push(update)

    const __commit = () => {
        const updates_ = updates
        updates = []
        commit(updates_)
    }

    updateRef.commiters.push(__commit)

    return {
        accept,
    }
}
