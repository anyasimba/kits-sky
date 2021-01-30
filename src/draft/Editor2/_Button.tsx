export const Button = (props) => {
    const {
        children,
    } = props

    return (
        <UIKit.Button {...props} rounded={false}>
            {children}
        </UIKit.Button>
    )
}
