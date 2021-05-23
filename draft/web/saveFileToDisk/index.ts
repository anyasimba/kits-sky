// production
import * as _ from './saveFileToDisk'
globalify(_, 'Web')

declare global {
    namespace Web {
        const saveFile: typeof _.saveFile
    }
}
