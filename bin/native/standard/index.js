/* eslint-disable no-console */
const path = require('path')
const fs = require('fs')
const { spawnSync } = require('child_process')

module.exports = (package, mode, cwd) => {
    const nodeGyp = path.normalize(
        path.resolve(__dirname, '../../../node_modules/.bin/node-gyp.cmd')
    )
    const buildDir = path.normalize(`${cwd}/.vscode/storage/${package.name}/server-native/`)

    function configure() {
        const config = {
            targets: [
                {
                    target_name: 'native',
                    include_dirs: [
                        path.normalize(`${path.resolve(__dirname, '../../../')}/`),
                        path.normalize(`${cwd}/`),
                    ],
                    sources: [],
                },
            ],
        }
        fromDir(path.resolve(__dirname, '../../../src/common/native'), '.cc', filePath => {
            config.targets[0].sources.push(filePath)
        })

        config.targets[0].sources.push(path.resolve(__dirname, 'main.cc'))

        fs.mkdirSync(buildDir, { recursive: true })
        fs.writeFileSync(`${buildDir}/binding.gyp`, JSON.stringify(config, null, 4))

        let r = spawnSync(nodeGyp, ['-j', 'max', '--release', '-C', buildDir, 'clean'], {
            stdio: 'inherit',
        })
        if (r.error) {
            console.error(r.error)
            process.exit(1)
        }
        r = spawnSync(nodeGyp, ['-j', 'max', '--release', '-C', buildDir, 'configure'], {
            stdio: 'inherit',
        })
        if (r.error || r.status !== 0) {
            console.error(r.error)
            process.exit(r.status)
        }
    }

    function build() {
        let r = spawnSync(nodeGyp, ['-j', 'max', '--release', '-C', buildDir, 'build'], {
            stdio: 'inherit',
        })
        if (r.error) {
            console.error(r.error)
            process.exit(1)
        }
    }

    return {
        configure,
        build,
    }
}

function fromDir(startPath, filter, cb) {
    if (!fs.existsSync(startPath)) {
        return
    }

    const files = fs.readdirSync(startPath)
    for (let i = 0; i < files.length; i++) {
        const filename = path.join(startPath, files[i])
        const stat = fs.lstatSync(filename)
        if (stat.isDirectory()) {
            fromDir(filename, filter, cb)
        } else if (filename.indexOf(filter) >= 0) {
            cb(filename)
        }
    }
}
