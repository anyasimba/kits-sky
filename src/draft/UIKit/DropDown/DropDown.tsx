// production
import './Dropdown.styl'

export class State {
    @mobx.observable showContent = false

    @mobx.action toggle () {
        this.showContent = !this.showContent
    }

    @mobx.action close () {
        this.showContent = false
    }
}

export const DropDown = () => {
    const state = mobx.makeObservable(new State)

    const Element = mobx.observer((props: {
        [x: string]: any
        children?: any
        className?: string
    }) => {
        const {
            children,
            className,
        } = props
    
        const b = cn('DropDown')
    
        const classNames = classnames(
            b(),
            className,
        )
    
        const $this = React.useRef<HTMLDivElement>()
    
        React.useEffect(() => {
            const handleClick = (e: MouseEvent) => {
                if (!$this.current.contains(e.target as any)) {
                    state.close()
                } else {
                    state.toggle()
                }
            }
            window.addEventListener('click', handleClick)
            return () => {
                window.removeEventListener('click', handleClick)
            }
        }, [])
    
        return (
            <div className={classNames} ref={$this}>
                {children[0]}
                {state.showContent && children[1]}
            </div>
        )
    })

    return {state, Element}
}

export const DropDownButton = mobx.observer((props: {
    [x: string]: any
    children?: any
    className?: string
}) => {
    const {
        children,
        className,
    } = props

    const b = cn('DropDownButton')

    const classNames = classnames(
        b(),
        className,
    )

    return (
        <div {...props} className={classNames}>
            {children}
        </div>
    )
})

export const DropDownContent = mobx.observer((props: {
    [x: string]: any
    children?: any
    className?: string
}) => {
    const {
        children,
        className,
    } = props

    const b = cn('DropDownContent')

    const classNames = classnames(
        b(),
        className,
    )

    return (
        <div {...props} className={classNames}>
            {children}
        </div>
    )
})
