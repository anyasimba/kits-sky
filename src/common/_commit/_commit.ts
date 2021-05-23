const callbacks: (() => void)[] = []

export function commit() {
    callbacks.forEach(cb => cb())
}

commit.add = (cb: () => void) => {
    callbacks.push(cb)
}
