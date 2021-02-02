import * as _ from './express'
globalify(_)

declare global {
    const express: typeof _.express
}
