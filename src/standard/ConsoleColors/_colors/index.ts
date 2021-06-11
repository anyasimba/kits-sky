export {}

declare global {
    interface Console {
        colors: typeof colors
    }
}

namespace colors {
    export const inverse = '\x1b[7m'
    export const reset = '\x1b[0m'

    export const fg = getColors(
        [...Array(256)].map((_, i) => {
            return '\x1b[38;5;' + i + 'm'
        })
    )

    export const bg = getColors(
        [...Array(256)].map((_, i) => {
            return '\x1b[48;5;' + i + 'm'
        })
    )
}
globalify({ colors }, console)

function getColors(codes: string[]) {
    return {
        codes,
        standard: {
            black: codes[0],
            red: codes[1],
            green: codes[2],
            yellow: codes[3],
            blue: codes[4],
            magenta: codes[5],
            cyan: codes[6],
            white: codes[7],
        },
        bright: {
            gray: codes[8],
            red: codes[9],
            green: codes[10],
            yellow: codes[11],
            blue: codes[12],
            magenta: codes[13],
            cyan: codes[14],
            white: codes[15],
        },
        _rgb: codes.slice(16, 232),
        grayscale: codes.slice(232, 256),
        rgb(r: number, g: number, b: number) {
            return colors.fg._rgb[36 * r + 6 * g + b]
        },
    }
}
