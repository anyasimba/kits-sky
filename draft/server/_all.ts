import * as bluebird from 'bluebird'
import * as Redis from 'redis'
bluebird.promisifyAll(Redis)
