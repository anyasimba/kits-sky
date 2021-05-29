import 'sky/common/commit'
import { purgatoryRef } from './_purgatoryRef'

commit.add(collectGarbage)

function collectGarbage() {
    while (purgatoryRef.purgatory.length > 0) {
        const hakunaMatatas = purgatoryRef.purgatory
        purgatoryRef.purgatory = []

        hakunaMatatas.forEach(hakunaMatata => {
            ;(hakunaMatata as any).__destroy()
        })
    }
}
