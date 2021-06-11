import * as _ from './&'
Object.assign(global, _)

declare global {
    const useForm: typeof _.useForm
}
