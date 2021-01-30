// production
interface RendererProps {
    size?: () => [number, number]

    onUpdateView? (w: number, h: number): void

    cameraViewAngle: number
    cameraZ: number
    node?: HTMLElement
}

export class Renderer extends Live {
    protected size: () => [number, number]

    onUpdateView? (w: number, h: number): void

    protected _renderer: THREE.WebGLRenderer

    camera: THREE.PerspectiveCamera
    scene: THREE.Scene = new THREE.Scene

    constructor (props: RendererProps) {
        super()

        const {
            size,

            onUpdateView,

            cameraViewAngle,
            cameraZ,
            node,
        } = props

        this.size = defaults(size, () => [
            this.node.offsetWidth,
            this.node.offsetHeight,
        ])

        this.onUpdateView = onUpdateView

        this._renderer = new THREE.WebGLRenderer({
            antialias: true,
            premultipliedAlpha: true,
        })

        this.camera = new THREE.PerspectiveCamera(
            cameraViewAngle,
            1,
            0.01,
            10000,
        )
        this.camera.position.z = defaults(cameraZ, 0)

        this.updateView = this.updateView.bind(this)

        if (node) {
            this.node = node
        }
    }

    node: HTMLElement = null
    @belongs private ':node' (node: HTMLElement) {
        link.append(node, this._renderer.domElement)
        this.updateView()
        link.addEventListener(window, 'resize', this.updateView)
    }

    updateView () {
        const [w, h] = this.size()
        this._renderer.setSize(w, h)
        this.camera.aspect = w / h
        this.camera.updateProjectionMatrix()

        this.onUpdateView && this.onUpdateView(w, h)
    }

    update () {
        this._renderer.render(this.scene, this.camera)
    }
}
