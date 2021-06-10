import 'sky/common/Update'
import 'sky/common/native'

// root
const root = withScope(() => {})(() => {})()!

// entities

// update
root.add(
    new IntervalWithDt(dt => {
        commit()
    }, 1000)
)

commit()
