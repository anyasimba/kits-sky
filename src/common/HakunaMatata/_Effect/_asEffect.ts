export function asEffect<T extends any[]>(effect: (detach: () => void, ...args: T) => () => void) {
    return class extends Effect {
        constructor(...args: T) {
            super()
            const destructor = effect(this.detach.bind(this), ...args)
            if (destructor) {
                this.onDestroy(destructor)
            }
        }
    }
}
