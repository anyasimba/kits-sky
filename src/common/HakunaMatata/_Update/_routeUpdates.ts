let routeUpdatesFn: ((update: Update) => void) | null = null
export function routeUpdates(fn: (update: Update) => void) {
    routeUpdatesFn = fn
}
