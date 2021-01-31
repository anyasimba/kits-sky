import * as _ from './express'
globally(_)

declare global {
    const express: typeof _.express
}
