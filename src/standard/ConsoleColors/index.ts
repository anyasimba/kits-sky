import * as _ from './ConsoleColors'
globalify(_)

declare global {
    function ConsoleColors(
        overrideConsole: boolean,
        Colors: (colors: typeof console.colors) => string[][]
    ): Console
}
