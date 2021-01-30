// production
import * as _ from './Renderer'
globally(_, 'Advanced')

declare global {
    namespace Advanced {
        type Renderer = _.Renderer
        const Renderer: typeof _.Renderer
    }
}
