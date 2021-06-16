import { applyArrayProp } from './_applyArrayProp'
import { applyMethod } from './_applyMethod'
import { applyProp } from './_applyProp'

export function apply(name: string, prototype: any, props: any, methods: any) {
    for (let i = 0; i < props.length; i++) {
        const prop = props[i]
        if (prop.type.indexOf('<') !== -1 || prop.type.indexOf('[') !== -1) {
            applyArrayProp(name, prototype, prop)
        } else {
            applyProp(name, prototype, prop)
        }
    }

    for (let i = 0; i < methods.length; i++) {
        const method = methods[i]
        applyMethod(name, prototype, method)
    }
}
