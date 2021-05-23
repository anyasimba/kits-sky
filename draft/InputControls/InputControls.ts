export enum InputControlsEvent {
    LEFT_MOUSE_DOWN,
    LEFT_MOUSE_UP,
    RIGHT_MOUSE_DOWN,
    RIGHT_MOUSE_UP,
    MIDDLE_MOUSE_DOWN,
    MIDDLE_MOUSE_UP,
    MOUSE_MOVE,
    KEY_DOWN,
    KEY_UP,
}

@circle_of_life
export class InputControls extends CircleOfLife {
    keys = {} as { [key: string]: boolean }
    mouse = {
        left: false,
        middle: false,
        right: false,
    } as {
        x: number
        y: number
        left: boolean
        middle: boolean
        right: boolean
    }

    private listeners = {
        [InputControlsEvent.LEFT_MOUSE_DOWN]: [] as (() => void)[],
        [InputControlsEvent.LEFT_MOUSE_UP]: [] as (() => void)[],
        [InputControlsEvent.RIGHT_MOUSE_DOWN]: [] as (() => void)[],
        [InputControlsEvent.RIGHT_MOUSE_UP]: [] as (() => void)[],
        [InputControlsEvent.MIDDLE_MOUSE_DOWN]: [] as (() => void)[],
        [InputControlsEvent.MIDDLE_MOUSE_UP]: [] as (() => void)[],
        [InputControlsEvent.MOUSE_MOVE]: [] as (() => void)[],
        [InputControlsEvent.KEY_DOWN]: [] as ((code: string, e: KeyboardEvent) => void)[],
        [InputControlsEvent.KEY_UP]: [] as ((code: string, e: KeyboardEvent) => void)[],
    }

    constructor() {
        super()

        document.addEventListener('contextmenu', this.onContextMenu)
        window.addEventListener('mousedown', this.onMouseDown)
        window.addEventListener('mousemove', this.onMouseMove)
        window.addEventListener('mouseup', this.onMouseUp)
        window.addEventListener('mousewheel', this.onMouseWheel)
        window.addEventListener('keydown', this.onKeyDown)
        window.addEventListener('keyup', this.onKeyUp)
    }

    destructor() {
        document.removeEventListener('contextmenu', this.onContextMenu)
        window.removeEventListener('mousedown', this.onMouseDown)
        window.removeEventListener('mouseup', this.onMouseUp)
        window.removeEventListener('keydown', this.onKeyDown)
        window.removeEventListener('keyup', this.onKeyUp)
    }

    addEventListener(eventType: InputControlsEvent, fn: any) {
        const listeners = this.listeners[eventType]
        listeners.push(fn)
    }

    removeEventListener(eventType: InputControlsEvent, fn: any) {
        const listeners = this.listeners[eventType]
        const idx = listeners.indexOf(fn)
        if (idx === -1) {
            throw new Error('callback not found')
        }
        listeners.splice(idx, 1)
    }

    private fireEvent(eventType: InputControlsEvent, ...args) {
        this.listeners[eventType].forEach((fn: any) => fn(...args))
    }

    @bind private onContextMenu(e: Event) {
        e.preventDefault()
    }

    @bind private onMouseDown(e: MouseEvent) {
        const { mouse } = this

        mouse.x = e.clientX
        mouse.y = e.clientY

        if (e.button === 0) {
            mouse.left = true
            this.fireEvent(InputControlsEvent.LEFT_MOUSE_DOWN)
        } else if (e.button === 1) {
            mouse.middle = true
            this.fireEvent(InputControlsEvent.MIDDLE_MOUSE_DOWN)
        } else if (e.button === 2) {
            mouse.right = true
            this.fireEvent(InputControlsEvent.RIGHT_MOUSE_DOWN)
        }
    }

    @bind private onMouseMove(e: MouseEvent) {
        const { mouse } = this

        mouse.x = e.clientX
        mouse.y = e.clientY

        this.fireEvent(InputControlsEvent.MOUSE_MOVE)
    }

    @bind private onMouseUp(e: MouseEvent) {
        const { mouse } = this

        mouse.x = e.clientX
        mouse.y = e.clientY

        if (e.button === 0) {
            mouse.left = false
            this.fireEvent(InputControlsEvent.LEFT_MOUSE_UP)
        } else if (e.button === 1) {
            mouse.middle = false
            this.fireEvent(InputControlsEvent.MIDDLE_MOUSE_UP)
        } else if (e.button === 2) {
            mouse.right = false
            this.fireEvent(InputControlsEvent.RIGHT_MOUSE_UP)
        }
    }

    @bind private onMouseWheel(e: WheelEvent) {}

    @bind private onKeyDown(e: KeyboardEvent) {
        const { keys } = this

        keys[e.code] = true

        this.fireEvent(InputControlsEvent.KEY_DOWN, e.code, e)
    }

    @bind private onKeyUp(e: KeyboardEvent) {
        const { keys } = this

        delete keys[e.code]

        this.fireEvent(InputControlsEvent.KEY_UP, e.code, e)
    }
}
