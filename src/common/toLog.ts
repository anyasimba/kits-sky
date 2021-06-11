export function toLog(...args: any[]) {
    let result = ''

    args.forEach(arg => {
        if (typeof arg !== 'object') {
            if (result !== '') {
                result += ' '
            }
            result += arg.toString()
            return
        }

        if (_.isArray)
    })

    return result
}
