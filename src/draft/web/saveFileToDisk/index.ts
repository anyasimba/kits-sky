// production
import * as _ from './saveFileToDisk'
globally(_, 'Web')

declare global {
    namespace Web {
        const saveFile: typeof _.saveFile
    }
}
