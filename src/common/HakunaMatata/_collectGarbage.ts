import { purgatoryRef } from './_purgatory'
import { __clearHakunaMatata } from './HakunaMatata'
import { __clearEffect } from './_Effect'

export function collectGarbage() {
    while (purgatoryRef.hakunaMatataPurgatory.length > 0) {
        const purgatory = purgatoryRef.hakunaMatataPurgatory
        purgatoryRef.hakunaMatataPurgatory = []
        purgatory.forEach(hakunaMatata => __clearHakunaMatata(hakunaMatata))
    }

    while (purgatoryRef.effectsPurgatory.length > 0) {
        const purgatory = purgatoryRef.effectsPurgatory
        purgatoryRef.effectsPurgatory = []
        purgatory.forEach(effect => __clearEffect(effect))
    }
}
