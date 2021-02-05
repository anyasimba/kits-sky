import { purgatoryRef } from './_purgatory'
import { __clearHakunaMatata } from './_HakunaMatata/_HakunaMatataClass'
import { __clearEffect } from './_Effect/_EffectClass'
import { updateRef } from './_useShared'

export function commit() {
    while (purgatoryRef.hakunaMatataPurgatory.length > 0) {
        const purgatory = purgatoryRef.hakunaMatataPurgatory
        purgatoryRef.hakunaMatataPurgatory = []
        purgatory.forEach(hakunaMatata => {
            console.log('remove', Object.getPrototypeOf(hakunaMatata))
            __clearHakunaMatata(hakunaMatata)
        })
    }

    console.log(purgatoryRef.effectsPurgatory.length)
    while (purgatoryRef.effectsPurgatory.length > 0) {
        const purgatory = purgatoryRef.effectsPurgatory
        purgatoryRef.effectsPurgatory = []
        purgatory.forEach(effect => __clearEffect(effect))
    }

    updateRef.updates.forEach
}
