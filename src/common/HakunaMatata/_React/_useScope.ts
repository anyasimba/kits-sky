export function useScope<T>(getScope: T) {
    const [_, set] = useState(0)
    useEffect(() => {
        const off = (getScope as any).on('change', () => set(value => ++value))
        return () => off()
    }, [getScope])
    return getScope
}
