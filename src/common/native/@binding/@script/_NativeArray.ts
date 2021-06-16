export const NativeArray = {}

toLogFilters.push((arg: any) => {
    if (typeof arg === 'object' && Object.getPrototypeOf(arg) === NativeArray) {
        return arg.items
    }
    return arg
})

export interface StaticNativeArray<T> {
    readonly length: number
    readonly items: T[]
    get(idx: number): T
    set(idx: number, value: T): void
}

export interface NativeArray<T> {
    readonly length: number
    readonly items: T[]
    get(idx: number): T
    set(idx: number, value: T): void
    add(value: T): void
    remove(value: T): void
    clear(): void
}

export interface StaticNativeArrayOfNative<T> {
    readonly length: number
    readonly items: T[]
    get(idx: number): T
}

export interface NativeArrayOfNative<T> {
    readonly length: number
    readonly items: T[]
    get(idx: number): T
    add(value: T): void
    remove(value: T): void
    clear(): void
}
