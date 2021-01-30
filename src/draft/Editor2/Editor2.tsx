// production
import { b } from './_b'
import { events } from './_events'
import { Polygons } from './_Polygons'
import { State } from './_State'
import { Menu } from './_Menu'
import './Editor2.styl'

class Interface {
    @mobx.observable onScreen = false

    @mobx.action toggle () {
        this.onScreen = !this.onScreen
    }

    @mobx.action close () {
        this.onScreen = false
    }
}

export const editor2 = mobx.makeObservable(new Interface)

export const Editor2 = mobx.observer(() => {
    const {
        onScreen,
    } = editor2

    const [state] = React.useState(mobx.makeObservable(new State)) as [State]

    const {
        editorRef,
        image,
        
        transformState,
    } = state

    const {
        realScale,
        shift,
    } = transformState

    React.useEffect(() => {
        return events(state)
    }, [onScreen])

    if (!onScreen) {
        return null
    }
    
    return (
        <div className={b()} ref={editorRef}>

            <Menu state={state} />
            
            <div className={b('editor')}>
                <div
                    className={b('editor-inner')}
                    style={{
                        transform: `scale(${realScale}) translate(${shift.x}px, ${shift.y}px)`,
                    }}
                >
                    {image && (
                        <img src={image} draggable={false} />
                    )}

                    <Polygons state={state} />
                </div>
            </div>
        </div>
    )
})
