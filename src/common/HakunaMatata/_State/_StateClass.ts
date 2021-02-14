const $$type = Symbol('type')
export const __getStateType = (self: IState) => self[$$type]

export type IState = {}
export const State = function () {
    // eslint-disable-next-line prefer-rest-params
    const self: IState = arguments[0]

    return {
        [$$type]: null,
    } as IState
}
