const SegfaultHandler = require('segfault-handler')
SegfaultHandler.registerHandler('crash.log')

import native from './native.node'
global.___NATIVE = native
