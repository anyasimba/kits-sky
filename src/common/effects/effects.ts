export const Timeout = (cb: () => void, time: number) => () => {
    const timeout = setTimeout(cb, time * 1000)
    return () => {
        clearTimeout(timeout)
    }
}

export const Interval = (cb: () => void, time: number) => () => {
    const interval = setInterval(cb, time * 1000)
    return () => {
        clearInterval(interval)
    }
}

export const HTMLEventListener = <K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
) => () => {
    element.addEventListener(type, listener, options)
    return () => element.removeEventListener(type, listener, options)
}

export const AnimationFrame = (cb: () => void) => () => {
    const request = requestAnimationFrame(cb)
    return () => {
        cancelAnimationFrame(request)
    }
}

export const EventListener = <T extends { on; off }>(
    source: T,
    type: string,
    listener: (...args: any[]) => void
) => () => {
    source.on(type, listener)
    return () => source.off(type, listener)
}
