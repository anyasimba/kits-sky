import { b } from './_b'
import { State } from './_State'

import { Button } from './_Button'

interface Props {
    state: State
}

export const Menu = mobx.observer(props => {
    return (
        <UIKit.InputGroup className={b('menu')}>
            <FileMenuItem {...props} />
            <EditMenuItem {...props} />
        </UIKit.InputGroup>
    )
})

const FileMenuItem = mobx.observer(({state}: Props) => {
    const [dropDown] = React.useState(UIKit.DropDown())

    const handleLoadImageClick = async () => {
        state.image = await Web.loadFile('data-url')
    }
    const handleSavePolygonsClick = async () => {
        Web.saveFile(JSON.stringify(state.polygonsState.polygons), 'polygons.json', 'text')
    }
    const handleLoadPolygonsClick = async () => {
        state.polygonsState.polygons = JSON.parse(await Web.loadFile('text'))
    }

    return (
        <dropDown.Element>
            <UIKit.DropDownButton>
                <div><Button className={b('menu-button')}>File</Button></div>
            </UIKit.DropDownButton>
            
            <UIKit.DropDownContent className={b('menu-item-menu')}>
                <div><Button className={b('menu-item-menu-item')} onClick={handleLoadImageClick}>Load Image</Button></div>
                <div><Button className={b('menu-item-menu-item')} onClick={handleLoadPolygonsClick}>Load Polygons</Button></div>
                <div><Button className={b('menu-item-menu-item')} onClick={handleSavePolygonsClick}>Save Polygons</Button></div>
            </UIKit.DropDownContent>
        </dropDown.Element>
    )
})

const EditMenuItem = mobx.observer(({state}: Props) => {
    const {
        toolsState,
    } = state

    const {
        tool,
        tools,
    } = toolsState

    const [dropDown] = React.useState(UIKit.DropDown())

    const handleMoveClick = async () => {
        toolsState.tool = tools.move
        toolsState.tool.mode = ''
    }

    const handleCreatePolygonClick = async () => {
        toolsState.tool = tools.createPolygon
        toolsState.tool.mode = ''
    }

    return (
        <dropDown.Element>
            <UIKit.DropDownButton>
                <Button className={b('menu-button')}>Edit</Button>
            </UIKit.DropDownButton>
            <UIKit.DropDownContent className={b('menu-item-menu')}>
                <div><Button className={b('menu-item-menu-item')} onClick={handleMoveClick}>Move</Button></div>
                <div><Button className={b('menu-item-menu-item')} onClick={handleCreatePolygonClick}>Create Polygon</Button></div>
            </UIKit.DropDownContent>
        </dropDown.Element>
    )
})
