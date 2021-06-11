import * as _ from './_'
Object.assign(global, _)

declare global {
    const useForm: typeof _.useForm
}
