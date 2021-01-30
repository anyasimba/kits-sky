import * as __ from './_'

export const link = new (class Link {
    static host: any
    static connector: any

    relation(on: () => void, off: () => void) {
        on()
        const relationsMap = (Link.connector[__.$$relations] =
            Link.connector[__.$$relations] || new Map())

        let relations = relationsMap.get(Link.host)
        if (relations == null) {
            relations = []
            relationsMap.set(Link.host, relations)
        }

        relations.push(off)
    }

    add(collection: any, item: any) {
        this.relation(
            () => {
                collection.add(item)
            },
            () => {
                collection.remove(item)
            }
        )
    }

    append(node: HTMLElement, child: HTMLElement) {
        this.relation(
            () => {
                node.appendChild(child)
            },
            () => {
                node.removeChild(child)
            }
        )
    }

    addEventListener(source: EventTarget, event: string, fn: EventListenerOrEventListenerObject) {
        this.relation(
            () => {
                source.addEventListener(event, fn)
            },
            () => {
                source.removeEventListener(event, fn)
            }
        )
    }
})()
