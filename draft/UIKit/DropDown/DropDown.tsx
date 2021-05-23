// production
import './Dropdown.styl'

export class DropDownState {
    @mobx.observable open = false
}

export const DropDown = () => {
    const state = mobx.makeObservable(new DropDownState)

    const Element = mobx.observer((props: {
        [key: string]: any
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
    
        useEffect(() => {
            const handleClick = (e: MouseEvent) => {
                if (!$this.current.contains(e.target as any)) {
                    state.open = false
                } else {
                    state.open = !state.open
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
    [key: string]: any
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
    [key: string]: any
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
