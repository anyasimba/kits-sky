import { updateRef } from './_updateRef'

export type Updater = {
    accept(update: Update): void
}
export const Updater = Effect((commit: (updates: Update[]) => void) => {
    const self = Self(Effect, () => ({
        accept,
    }))

    let updates: Update[] = []

    const accept = (update: Update) => updates.push(update)

    const __commit = () => {
        const updates_ = updates
        updates = []
        commit(updates_)
    }

    use(() => {
        updateRef.commiters.push(__commit)
        return () => updateRef.commiters.splice(updateRef.commiters.indexOf(__commit), 1)
    })

    return self
})
