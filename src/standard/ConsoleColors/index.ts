import * as _ from './ConsoleColors'
globally(_)

declare global {
    function ConsoleColors(
        overrideConsole: boolean,
        Colors: (colors: typeof console.colors) => string[][]
    ): Console
}
