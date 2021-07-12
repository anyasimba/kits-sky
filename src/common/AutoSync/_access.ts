export type access = typeof access
export function access(fn: (watcher: Watcher) => boolean) {
    return function (target: any, key: string | symbol) {}
}
