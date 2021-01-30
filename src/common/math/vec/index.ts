import * as _ from './vec'
globally(_)

declare global {
    type vec2 = _.vec2
    const vec2: typeof _.vec2

    type vec3 = _.vec3
    const vec3: typeof _.vec3
}
