const Test = HakunaMatata(() => {
    const self = Self(HakunaMatata, () => ({}))
    // eslint-disable-next-line no-console
    console.log('Test')
    return self
})

export const test = Pure(() => {
    Test()
})
