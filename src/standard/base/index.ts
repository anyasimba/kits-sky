import * as _ from './base'
globally(_)

declare global {
    interface fs extends _.fs {}
    const fs: fs

    interface path extends _.path {}
    const path: path

    interface childProcess extends _.childProcess {}
    const childProcess: childProcess
}
