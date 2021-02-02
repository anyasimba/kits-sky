export type TiledMapPolygon = {
    x: number
    y: number
    polygon: Polygon
}

export type TiledMapPoint = {
    x: number
    y: number
    [prop: string]: string | number
}

export class TiledMap {
    dom: Document

    polygons: TiledMapPolygon[] = []
    points: TiledMapPoint[] = []

    constructor(xml) {
        const parser = new DOMParser()
        const dom = (this.dom = parser.parseFromString(xml, 'application/xml'))
        if (dom.documentElement.nodeName == 'parsererror') {
            throw new Error('error while parsing')
        }
        this.__update()
    }

    private __update() {
        const { dom } = this
        const document = dom.documentElement
        for (let i = 0; i < document.children.length; i++) {
            const node = document.children[i]
            if (node.nodeName === 'objectgroup') {
                this.__objectGroup(node)
            }
        }
    }

    private __objectGroup(node: Element) {
        for (let i = 0; i < node.children.length; i++) {
            const childNode = node.children[i]
            const x = parseFloat(childNode.attributes.getNamedItem('x')!.nodeValue!)
            const y = parseFloat(childNode.attributes.getNamedItem('y')!.nodeValue!)
            const itemW = childNode.attributes.getNamedItem('width')
            const itemH = childNode.attributes.getNamedItem('height')
            const w = itemW && parseFloat(itemW.nodeValue!)
            const h = itemH && parseFloat(itemH.nodeValue!)
            if (w != null) {
                const polygon = new Polygon()
                polygon.points = [
                    new vec2({ x: 0, y: 0 }),
                    new vec2({ x: w, y: 0 }),
                    new vec2({ x: w, y: -h! }),
                    new vec2({ x: 0, y: -h! }),
                ]
                this.polygons.push({ x, y: -y, polygon })
            } else if (childNode.children[0].nodeName === 'polygon') {
                this.__polygon(x, y, childNode)
            } else if (childNode.children[0].nodeName === 'point') {
                this.__point(x, y, childNode)
            }
        }
    }

    private __polygon(x: number, y: number, node: Element) {
        const pointsStr = node.children[0].attributes.getNamedItem('points')!.nodeValue!
        const points = pointsStr.split(' ').map(str => {
            const [x, y] = str.split(',').map(v => parseFloat(v))
            return new vec2({ x, y: -y })
        })
        const polygon = new Polygon()
        polygon.points = points
        this.polygons.push({ x, y: -y, polygon })
    }

    private __point(x: number, y: number, node: Element) {
        const p: Partial<TiledMapPoint> = {}

        for (let i = 0; i < node.attributes.length; i++) {
            const attribute = node.attributes[i]
            p[attribute.nodeName] = attribute.nodeValue!
        }
        p.x = x
        p.y = -y

        this.points.push(p as TiledMapPoint)
    }
}
