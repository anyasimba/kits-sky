export const Timeout = asEffect((cb: () => void, time: number) => {
    const timeout = setTimeout(() => action(cb), time * 1000)
    return () => {
        clearTimeout(timeout)
    }
})

export const Interval = asEffect((cb: () => void, time: number) => {
    const interval = setInterval(() => action(cb), time * 1000)
    return () => {
        clearInterval(interval)
    }
})

export const HTMLEventListener = asEffect(
    <K extends keyof HTMLElementEventMap>(
        element: HTMLElement,
        type: K,
        listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ) => {
        listener = function (this: HTMLElement, ev: HTMLElementEventMap[K]) {
            action(() => listener.call(this, ev))
        }
        element.addEventListener(type, listener, options)
        return () => element.removeEventListener(type, listener, options)
    }
)

export const AnimationFrame = asEffect((cb: () => void) => {
    const request = requestAnimationFrame(() => action(cb))
    return () => {
        cancelAnimationFrame(request)
    }
})

export const EventListener = asEffect(
    <T extends { on; off }>(source: T, type: string, listener: (...args: any[]) => void) => {
        listener = function (...args: any[]) {
            action(() => listener(...args))
        }
        source.on(type, listener)
        return () => source.off(type, listener)
    }
)
