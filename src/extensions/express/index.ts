import * as _ from './&'
globalify(_)

declare global {
    const express: typeof _.express
}
