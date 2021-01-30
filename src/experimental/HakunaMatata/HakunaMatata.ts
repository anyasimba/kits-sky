import './@CircleOfLife'
import './@Live'
import * as __ from './_'

export * from './@@alive'
export * from './@@belongs'
export * from './@@fireEvent'
export * from './@@link'

export const HakunaMatata = new (class HakunaMatata {
    [__.$$alives]: __.Alive[] = []

    add<T extends __.Alive>(alive: T) {
        __.state.relations.push(() => {
            if (this[__.$$alives].indexOf(alive) !== -1) {
                throw new Error('alive already exists')
            }

            this[__.$$alives].push(alive)

            if (alive[__.$$host]) {
                alive[__.$$detachAlive](alive[__.$$host])
            }

            alive[__.$$attachAlive]([
                this,
                () => {
                    const alives = this[__.$$alives]
                    alives.splice(alives.indexOf(alive))
                },
            ])
        })

        return alive
    }

    remove(alive: __.Alive) {
        __.state.relations.push(() => {
            const idx = this[__.$$alives].indexOf(alive)
            if (idx === -1) {
                throw new Error('live not found')
            }

            this[__.$$alives].splice(idx, 1)

            alive[__.$$detachAlive]((this as any) as Live)
        })
    }

    clear() {
        __.state.relations.push(() => {
            const alives = this[__.$$alives]
            for (let i = 0; i < alives.length; i++) {
                const alive = alives[i]
                alive[__.$$detachAlive]((this as any) as Live)
            }
            this[__.$$alives] = []
        })
    }

    fireEvent(name: string, ...args) {
        __.collectGarbage()

        const alives = this[__.$$alives]
        for (let i = 0; i < alives.length; i++) {
            const alive = alives[i]
            fireEvent(alive, name, ...args)
        }
    }

    async animationFrames(main: Function) {
        await main()

        let savedTime = Date.now()
        const animationFrame = () => {
            requestAnimationFrame(animationFrame)
            const time = Date.now()
            const dt = Math.min((time - savedTime) * 0.001, 0.05)
            savedTime = time

            this.fireEvent('update', dt)
        }
        requestAnimationFrame(animationFrame)
    }

    async frames(main: Function) {
        await main()

        let savedTime = Date.now()
        const frames = 50
        while (true) {
            const time = Date.now()
            const dt = Math.min((time - savedTime) * 0.001, 0.05)
            savedTime = time

            this.fireEvent('update', dt)

            await sleep(Math.max(0, 1 / frames - (Date.now() - savedTime) * 0.001))
        }
    }
})()
