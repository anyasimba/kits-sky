import * as _ from './loadFileFromDisk'
globalify(_, 'Web')

declare global {
    namespace Web {
        const loadFile: typeof _.loadFile
        const loadFileFrom: typeof _.loadFileFrom
    }
}
