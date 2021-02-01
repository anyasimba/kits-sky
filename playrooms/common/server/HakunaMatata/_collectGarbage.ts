import { purgatoryRef } from './_purgatory'
import { $$dead, $$lives } from './HakunaMatata'

export function collectGarbage() {
    purgatoryRef.value.forEach(hakunaMatata => {
        hakunaMatata[$$dead] = true
        hakunaMatata[$$lives].forEach(live => live.destroy())
    })
    purgatoryRef.value = []
}
