/* eslint-disable no-console */
export {}

declare global {
    type overrideConsole = _.overrideConsole
    const overrideConsole: typeof _.overrideConsole
}

const methods = ['dir', 'dirxml', 'error', 'info', 'log', 'table', 'warn'] as (keyof Console)[]

namespace _ {
    export type overrideConsole = typeof overrideConsole
    export function overrideConsole(handler: (...args: any[]) => any[]) {
        methods.forEach(method => {
            const base = console[method]
            console[method] = (...args: any[]) => base.call(console, ...handler(...args))
        })
    }
}

globalify(_)
