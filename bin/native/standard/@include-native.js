const SegfaultHandler = require('segfault-handler')
SegfaultHandler.registerHandler('crash.log')

const r = require
// eslint-disable-next-line no-undef
const native = r(___NATIVE_PATH)
global.___NATIVE = native
