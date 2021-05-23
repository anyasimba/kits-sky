// production
import 'sky/web'
import 'sky/common'
import 'sky/advanced/UIKit'
import * as _ from './Editor2'
globalify(_, 'Advanced')

declare global {
    namespace Advanced {
        const Editor2: typeof _.Editor2

        const editor2: typeof _.editor2
    }
}
