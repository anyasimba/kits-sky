const fs = require('fs')
require('source-map-support').install({
    retrieveSourceMap: function (source: any) {
        if (!fs.existsSync(`${source}.map`)) {
            return null
        }
        return {
            url: ' ',
            map: fs.readFileSync(`${source}.map`, 'utf8'),
        }
    },
})
import '../base'
