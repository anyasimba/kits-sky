import * as chroma from 'chroma-js'

class Color_ {
    l: number
    c: number
    h: number
    a: number

    r: number
    g: number
    b: number

    constructor(l: number, c: number, h: number, a: number) {
        this.l = l
        this.c = c
        this.h = h

        const rgb = chroma.lch(l, c, h).rgb()
        this.r = rgb[0]
        this.g = rgb[1]
        this.b = rgb[2]

        this.a = a
    }

    hex() {
        const { r, g, b } = this
        return (1 << 24) + (r << 16) + (g << 8) + b
    }

    name() {
        let { l, c, h } = this

        h = h % 360
        const ret = []

        if (l < 35) {
            ret.push('Dark')
        } else if (l > 70) {
            ret.push('Light')
        }

        if (c > 10) {
            if (c < 35) {
                ret.push('Muted')
            } else if (c > 70) {
                if (l > 60) {
                    ret.push('Bright')
                }
            }

            // Chromatic
            for (const [hue, baseColor] of Object.entries({
                20: 'Pink',
                40: 'Red',
                60: 'Orange',
                100: 'Yellow',
                150: 'Green',
                210: 'Cyan',
                260: 'Blue',
                320: 'Purple',
                360: 'Pink',
            })) {
                if (h <= (hue as any)) {
                    ret.push(baseColor)
                    break
                }
            }
        } else {
            if (c > 1) {
                ret.unshift(h < 120 || h > 300 ? 'Warm' : 'Cool')
            }

            ret.push('Gray')
        }

        let retStr = ret.join(' ')

        if (/Yellow$/.test(retStr) && l < 40) {
            // Dark Yellow is an oxymoron
            retStr = 'Brown'
        }

        return retStr
    }
}

export type Color = typeof Color
export function Color(l: number, c: number, h: number, a: number = 100) {
    return new Color_(l, c, h, a)
}
