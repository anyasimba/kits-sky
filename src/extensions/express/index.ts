import * as _ from './_'
globalify(_)

declare global {
    const express: typeof _.express
}
