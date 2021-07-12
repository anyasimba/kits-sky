import * as _ from './_'
globalify(_)

declare global {
    function ConsoleColors(
        overrideConsole: boolean,
        Colors: (colors: typeof console.colors) => string[][]
    ): Console
}
