import { IEffect } from './_Effect/_EffectClass'
import { runtimeRef } from './_runtime'

export function useShared<T>(getInitialValue: () => T, key: string) {
    return getInitialValue()
}

type DynamicNotAFunction = { [k: string]: unknown } & ({ bind?: never } | { call?: never })
export function Dynamic<T extends DynamicNotAFunction>(fn: () => T): T {
    return fn()
}

export enum ActionMode {
    TRANSPARENT,
    PURE,
    CONTINUS,
}
export function asAction<T extends any[], R>(mode: ActionMode, fn: (...args: T) => R) {
    ;(fn as any).mode = mode
    return fn
}

export function action<T extends () => void>(fn: T) {
    runtimeRef.runtime = true

    // TODO if pure
    fn()
    commit()
}

export const updateRef = { updates: [] as Update[], commiters: [] as (() => void)[] }

export type Update = {}
export function accept(
    update: Update,
    map: Map<IHakunaMatata | IEffect, IHakunaMatata | IEffect>
) {}

export function routeUpdates(fn: (update: Update) => void) {}

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
