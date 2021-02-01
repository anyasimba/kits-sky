import { purgatoryRef } from './_purgatory'
import { $$dead, $$destructors, $$hakunaMatatas } from './HakunaMatata'

export function collectGarbage() {
    purgatoryRef.hakunaMatataPurgatory.forEach(hakunaMatata => {
        hakunaMatata[$$dead] = true
        hakunaMatata[$$hakunaMatatas].forEach(hakunaMatata => hakunaMatata.remove())
        hakunaMatata[$$destructors].forEach(destructor => destructor())
    })
    purgatoryRef.hakunaMatataPurgatory = []

    purgatoryRef.effectsPurgatory.forEach(effect => {
        effect[$$destructors].forEach(destructor => destructor())
    })
    purgatoryRef.effectsPurgatory = []
}
