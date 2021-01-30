// production
import * as _ from './loadFileFromDisk'
globally(_, 'Web')

declare global {
    namespace Web {
        const loadFile: typeof _.loadFile
        const loadFileFrom: typeof _.loadFileFrom
    }
}
