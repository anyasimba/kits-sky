// production
import './Button.styl'

export type ButtonProps = {
    [key: string]: any
    children?: any
    className?: string
    size?: 'small'|'medium'|'big'
    kind?: 'primary'|'secondary'|'success'|'warn'|'danger'
    rounded?: boolean
}

export const Button = mobx.observer((props: ButtonProps) => {
    const propsKeys = [
        'children',
        'className',
        'size',
        'kind',
        'rounded',
    ]

    const {
        children,
        className,
        size,
        kind,
        rounded,
    } = props

    const b = cn('Button')
    const classNames = classnames(
        b(),
        b({size}),
        b({kind}),
        b({'angulate': !rounded}),
        className,
    )

    const buttonProps = Object.keys(props)
        .filter(key => !propsKeys.includes(key))
        .reduce((obj, key) => {
            obj[key] = props[key]
            return obj
        }, {})

    return (
        <button {...buttonProps} className={classNames} >
            {children}
        </button>
    )
})
