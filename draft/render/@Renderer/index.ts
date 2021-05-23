// production
import * as _ from './Renderer'
globalify(_, 'Advanced')

declare global {
    namespace Advanced {
        type Renderer = _.Renderer
        const Renderer: typeof _.Renderer
    }
}
