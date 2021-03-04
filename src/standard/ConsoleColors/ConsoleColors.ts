import './_colors'

export function ConsoleColors(
    overrideConsole: boolean,
    Colors: (colors: typeof console.colors) => string[][]
) {
    let newConsole: Console
    if (overrideConsole) {
        newConsole = console
    } else {
        newConsole = Object.assign({}, base)
    }

    // eslint-disable-next-line no-console
    const colors = Colors(console.colors)

    for (let i = 0; i < colors.length; i++) {
        const [level, ...levelColors] = colors[i]
        extend(newConsole, level, ...levelColors)
    }

    if (!overrideConsole) {
        return newConsole
    }
}

const base = Object.assign({}, console)
const stream = process.stdout

function extend(newConsole: Console, level: string, ...colors: string[]) {
    const color = colors.join('')
    newConsole[level] = function (...params) {
        stream.write(color)
        base[level](...params)
        // eslint-disable-next-line no-console
        stream.write(console.colors.reset)
    }
}

process.on('uncaughtException', error => {
    // eslint-disable-next-line no-console
    console.error(error)
})
