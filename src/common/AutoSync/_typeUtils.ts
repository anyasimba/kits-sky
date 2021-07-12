export function toType(typeDescription: string) {
    return typeDescription.split('|').map(type => type.trim())
}

export function isPrimitive(type: string) {
    if (type !== 'number' && type !== 'string' && type !== 'boolean') {
        return false
    }

    return true
}

export function isObj(type: string) {
    if (isPrimitive(type)) {
        return false
    }

    if (isArray(type)) {
        return false
    }

    return true
}

export function arrayType(type: string) {
    return type.slice(0, -2)
}

export function isArray(type: string) {
    return hasArraySign(type)
}

export function isPrimitiveArray(type: string) {
    return hasArraySign(type) && isPrimitive(arrayType(type))
}

export function isObjArray(type: string) {
    return hasArraySign(type) && isObj(arrayType(type))
}

export function isOptional(types: string[]) {
    return types[1] === 'null'
}

function hasArraySign(type: string) {
    return type.indexOf('[]') !== -1
}
