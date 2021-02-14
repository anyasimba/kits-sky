export const Timeout = asEffect((cb: () => void, time: number) => {
    const timeout = setTimeout(() => cb, time * 1000)
    return () => clearTimeout(timeout)
})

export const Interval = asEffect((cb: () => void, time: number) => {
    const interval = setInterval(() => cb, time * 1000)
    return () => clearInterval(interval)
})

export const HTMLEventListener = asEffect(
    <K extends keyof HTMLElementEventMap>(
        element: HTMLElement,
        type: K,
        listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ) => {
        element.addEventListener(type, listener, options)
        return () => element.removeEventListener(type, listener, options)
    }
)

export const AnimationFrame = asEffect((cb: () => void) => {
    const request = requestAnimationFrame(cb)
    return () => cancelAnimationFrame(request)
})

export const AnimationFrames = asEffect((cb: () => void) => {
    let request
    function tick() {
        request = requestAnimationFrame(tick)
        cb()
    }
    requestAnimationFrame(tick)
    return () => cancelAnimationFrame(request)
})

export const EventListener = asEffect(
    <T extends { on; off? }>(source: T, type: string, listener: (...args: any[]) => void) => {
        const off = source.on(type, listener)
        return () => (off ? off() : source.off(type, listener))
    }
)
