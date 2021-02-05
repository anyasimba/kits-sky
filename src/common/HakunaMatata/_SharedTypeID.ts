let id = 0
const map: Map<number, any> = new Map()

export const SharedTypeID = {
    new(constructor: any) {
        map.set(id, constructor)
        return id++
    },
    get(id: number) {
        return map.get(id)
    },
}
