declare global {
    const commit: typeof _.commit
}

namespace _ {
    const callbacks: (() => void)[] = []

    export function commit() {
        callbacks.forEach(cb => cb())
    }

    commit.add = (cb: () => void) => {
        callbacks.push(cb)
    }
}

globalify(_)
export {}
