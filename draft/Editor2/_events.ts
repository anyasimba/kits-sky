import { State } from './_State'

export function events (state: State) {
    const {
        editorRef,
        
        toolsState,
        transformState,
        polygonsState,
    } = state

    const $editor = editorRef.current
    
    if (!$editor) {
        return
    }
    
    const interval = setInterval(() => {
        const {
            scale,
            realScale,
        } = transformState

        transformState.realScale = realScale + (scale - realScale) * 0.2
    }, 10)
    
    const handleMouseDown = (e: MouseEvent) => {
        const {
            tool,
        } = toolsState

        if (tool == null) {
            return
        }
        if (e.button === 0) {
            tool.onLeftMouseDown(e.clientX, e.clientY)
        } else if (e.button === 2) {
            tool.onRightMouseDown(e.clientX, e.clientY)
        }
    }
    
    const handleMouseUp = (e: MouseEvent) => {
        const {
            tool,
        } = toolsState

        if (tool == null) {
            return
        }
        if (e.button === 0) {
            tool.onLeftMouseUp(e.clientX, e.clientY)
        } else if (e.button === 2) {
            tool.onRightMouseUp(e.clientX, e.clientY)
        }
    }
    
    const handleMouseMove = (e: MouseEvent) => {
        const {
            tool,
        } = toolsState

        if (tool == null) {
            return
        }
        tool.onMouseMove(e.clientX, e.clientY)
    }
    
    const handleMouseWheel = (e: WheelEvent) => {
        const {
            scale,
        } = transformState

        transformState.scale = scale * (1 + (e.deltaY > 0? -1:1)*0.1)
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
        const {
            oldTool,
            tool,
            tools,
        } = toolsState

        if (e.code === 'AltLeft' && oldTool == null) {
            toolsState.oldTool = tool
            toolsState.tool = tools.move
            tools.move.mode = ''
            return
        } else if (e.code === 'Escape') {
            toolsState.tool = tools.edit
            toolsState.tool.mode = ''
            polygonsState.selectedPolygon = null
        }

        if (tool == null) {
            return
        }

        tool.onKeyDown(e.code)
    }
    
    const handleKeyUp = (e: KeyboardEvent) => {
        const {
            oldTool,
            tool,
            tools,
        } = toolsState

        if (e.code === 'AltLeft') {
            toolsState.tool = oldTool
            toolsState.oldTool = null
            return
        }

        if (tool == null) {
            return
        }

        tool.onKeyUp(e.code)
    }
    
    const handleContextMenu = (e: Event) => {
        e.preventDefault()
    }
    
    $editor.addEventListener('mousedown', handleMouseDown)
    $editor.addEventListener('mousemove', handleMouseMove)
    $editor.addEventListener('mouseup', handleMouseUp)
    $editor.addEventListener('mousewheel', handleMouseWheel)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    document.addEventListener('contextmenu', handleContextMenu)
    
    return () => {
        if (!$editor) {
            return
        }
        
        clearInterval(interval)
        $editor.removeEventListener('mousedown', handleMouseDown)
        $editor.removeEventListener('mousemove', handleMouseMove)
        $editor.removeEventListener('mouseup', handleMouseUp)
        $editor.removeEventListener('mousewheel', handleMouseWheel)
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('keyup', handleKeyUp)
        document.removeEventListener('contextmenu', handleContextMenu)
    }
}
