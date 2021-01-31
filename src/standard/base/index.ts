import * as _ from './base'
globally(_)

declare global {
    interface fs extends _.fs {}
    const fs: fs

    interface path extends _.path {}
    const path: path

    interface childProcess extends _.childProcess {}
    const childProcess: childProcess

    interface http extends _.http {}
    const http: http

    interface https extends _.https {}
    const https: https
}
