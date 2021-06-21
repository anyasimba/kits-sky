import React_ from 'react'
import ReactDOM_ from 'react-dom'
import * as _ from './_'
globalify(_)
globalify({
    React: React_,
    ReactDOM: ReactDOM_,
})

declare global {
    const React: typeof React_
    const ReactDOM: typeof ReactDOM_
    function useEffect(
        effect: React_.EffectCallback,
        deps?: React_.DependencyList | undefined
    ): void
    const useCallback: typeof _.useCallback
    const useRef: typeof _.useRef
    const useState: typeof _.useState
    const useMemo: typeof _.useMemo
    const memo: typeof _.memo
}
