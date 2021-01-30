import * as _ from './AABB'
globally(_)

declare global {
    type AABB2 = _.AABB2
    const AABB2: typeof _.AABB2

    type AABB3 = _.AABB3
    const AABB3: typeof _.AABB3
}
