export const Body = asEffect(() => {
    // eslint-disable-next-line no-console
    console.log('body')
    return () => {
        // eslint-disable-next-line no-console
        console.log('remove body')
        //
    }
})
