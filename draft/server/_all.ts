import * as bluebird from 'bluebird'
import * as Redis from 'redis'
bluebird.promisifyAll(Redis)

declare const global
global.native = require('./build/Release/native.node')
global.isExternal = native.isExternal
