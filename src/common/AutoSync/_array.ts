export class array<T> {
    private __array: T[] = []

    get(index: number) {
        return this.__array[index]
    }

    set(index: number, value: T) {
        this.__array[index] = value
    }

    add(value: T) {
        this.__array.push(value)
    }

    remove(value: T) {
        this.__array.splice(this.__array.indexOf(value), 1)
    }

    splice(start: number, deleteCount: number) {
        this.__array.splice(start, deleteCount)
    }

    clear() {
        this.__array = []
    }
}
