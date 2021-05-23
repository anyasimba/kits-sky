// production
import './InputGroup.styl'

type Props = {
    children?: any
    className?: string
}

export const InputGroup = (props: Props) => {
    const {
        children,
        className,
    } = props

    const b = cn('InputGroup')
    
    const classNames = classnames(
        b(),
        className,
    )

    return (
        <div {...props} className={classNames}>
            {children}
        </div>
    )
}
