import 'sky/common/_commit'
import { purgatoryRef } from './_purgatoryRef'

commit.add(collectGarbage)

function collectGarbage() {
    while (purgatoryRef.hakunaMatataPurgatory.length > 0) {
        const hakunaMatatas = purgatoryRef.hakunaMatataPurgatory
        purgatoryRef.hakunaMatataPurgatory = []

        hakunaMatatas.forEach(hakunaMatata => {
            ;(hakunaMatata as any).__clear()
        })
    }

    const effects = purgatoryRef.effectsPurgatory
    purgatoryRef.effectsPurgatory = []
    effects.forEach(effect => {
        ;(effect as any).__clear()
    })
}
