// TODO
// Взаимосвязи
// Экшены и синхронизация

import * as _ from './@'
globally(_)

// eslint-disable-next-line no-console
console.log('No worries!')

declare global {
    const HakunaMatata: typeof _.HakunaMatata & typeof _.HakunaMatataClass
    const Effect: typeof _.Effect
    type PureEffect = _.PureEffect

    const Self: typeof _.Self
}
