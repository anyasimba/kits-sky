import 'sky/common/HakunaMatata/_AutoSync/_shared'
import 'sky/common/Update'

import './_React'
import './_Relation'
import './_Scope'
import './_collectGarbage'
import './_HakunaMatata'
export { link } from './_decorators'
export { HakunaMatata } from './_HakunaMatata'

export * from './_@lib'

export const root = withScope(() => {})(() => {})()!
