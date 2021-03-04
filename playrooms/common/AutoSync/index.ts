import 'sky/common/AutoSync'

function nullable<T>(value?: T | null): T | null {
    if (value === undefined) {
        return null
    }
    return value
}
function optional<T>(value?: T): typeof value {
    return value
}

const test = Shared({
    x: optional<number>(19),
    y: optional<number>(19),
    z: optional<number>(19),
})
