export const routeUpdatesRef: { routeUpdates: ((update: Update) => void) | null } = {
    routeUpdates: null,
}

export function routeUpdates(routeUpdates: (update: Update) => void) {
    routeUpdatesRef.routeUpdates = routeUpdates
}
