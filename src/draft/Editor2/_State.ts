import { Tool } from './_Tool'
import { EditTool, MoveTool, CreatePolygonTool } from './_tools'

export class State {
    @mobx.observable forceUpdated = 0
    @mobx.action forceUpdate () {
        this.forceUpdated = ++this.forceUpdated
    }
    
    @mobx.observable editorRef = React.useRef<HTMLDivElement>()
    @mobx.observable image: string = null

    @mobx.observable toolsState = mobx.makeObservable(new ToolsState)
    @mobx.observable transformState = mobx.makeObservable(new TransformState)
    @mobx.observable polygonsState = mobx.makeObservable(new PolygonsState)

    constructor () {
        const {
            tools
        } = this.toolsState
        
        tools.edit = mobx.makeObservable(new EditTool(this))
        tools.move = mobx.makeObservable(new MoveTool(this))
        tools.createPolygon = mobx.makeObservable(new CreatePolygonTool(this))
    }
    
    toLocalPoint (p: vec2) {
        const {
            editorRef,
        } = this

        const {
            shift,
            scale,
        } = this.transformState

        const $editor = editorRef.current

        const x = (p.x - $editor.offsetWidth*0.5) / scale - shift.x
        const y = (p.y - $editor.offsetHeight*0.5) / scale - shift.y
        
        return new vec2({x, y})
    }
}

class TransformState {
    @mobx.observable shift = {
        x: 0,
        y: 0,
    }
    @mobx.observable scale = 1
    @mobx.observable realScale = 1
}

class ToolsState {
    @mobx.observable tools = {
        edit: null as Tool,
        move: null as Tool,
        createPolygon: null as Tool,
    }
    @mobx.observable oldTool: Tool = null
    @mobx.observable tool: Tool = null
}

class PolygonsState {
    @mobx.observable polygons: Polygon[] = []
    @mobx.observable selectedPolygon: Polygon = null

    @mobx.computed get polygon () {
        return this.polygons[this.polygons.length - 1]
    }

    @mobx.action addPolygon () {
        this.polygons.push({
            points: [],
        })
    }

    @mobx.action removePolygon (polygon: Polygon) {
        this.polygons.splice(this.polygons.indexOf(polygon))
    }

    @mobx.action addPoint (polygon: Polygon, {x, y}) {
        polygon.points.push(new vec2({x, y}))
    }

    @mobx.action removePoint (polygon: Polygon, i) {
        polygon.points.splice(i, 1)
    }
}
