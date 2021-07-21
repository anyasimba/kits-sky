#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fs = require('fs')
const os = require('os')
const child_process = require('child_process')
const esbuild = require('esbuild')
const express = require('express')
const getEsbuildConfigGetter = require('./getEsbuildConfigGetter')
const getStandardNative = require('./native/standard')
const getWebNative = require('./native/web')

const [command, mode] = getArgs()
const cwd = process.cwd()

const package = getModule(path.join(cwd, 'package.json'))
const hasClient = package.client !== false
const hasServer = package.server || package.client === false

switch (command) {
    case 'start': {
        const esbuildConfigGetter = getEsbuildConfigGetter(package, mode, cwd)

        if (hasClient) {
            const app = express()

            const config = esbuildConfigGetter.getClientConfig()
            config.inject.push(path.join(__dirname, '@inject-hot-reload.js'))
            let result
            esbuild
                .build({
                    ...config,
                    write: false,
                    watch: {
                        onRebuild(error, result_) {
                            if (error) {
                                console.error('build failed:', error)
                            } else {
                                console.log('--- client build succeeded ---')
                                result = result_
                            }
                        },
                    },
                })
                .then(result_ => {
                    result = result_
                })

            app.use((req, res, next) => {
                if (req.url === '/web-native.js') {
                    res.send(fs.readFileSync(path.join(cwd, '.vscode/storage/web-native.js')))
                        .status(200)
                        .end()
                    return
                }
                let finded = false
                result.outputFiles.forEach(file => {
                    if (finded) {
                        return
                    }
                    if (
                        path.normalize(path.join(cwd, 'dist/client', req.url)) ===
                        path.normalize(file.path)
                    ) {
                        res.send(file.text).status(200).end()
                        finded = true
                    }
                })
                if (finded) {
                    return
                }
                next()
            })
            app.use(express.static(path.join(cwd, 'public')))
            app.use((req, res) => {
                let title = package.name
                if (package.client && package.client.title) {
                    title = package.client.title
                }

                res.send(getHtml(title, ['/web-native.js', '/app.js']))
                    .status(200)
                    .end()
            })
            app.listen(3019)
        }

        if (hasServer) {
            fs.mkdtemp(path.join(os.tmpdir()), (err, folder) => {
                if (err) {
                    throw err
                }

                const config = esbuildConfigGetter.getServerConfig(folder)

                esbuild
                    .build({
                        ...config,
                        watch: {
                            onRebuild(error, result) {
                                if (error) {
                                    console.error('build failed:', error)
                                } else {
                                    restart()
                                }
                            },
                        },
                    })
                    .then(result => {
                        restart()
                    })

                let childProcess
                let isWatchNative = false
                function restart() {
                    console.log('--- build succeeded ---')

                    if (!isWatchNative && package.server && package.server.native) {
                        isWatchNative = true
                        const nativePath = `${cwd}/.vscode/storage/server-native/build/Release/native.node`
                        fs.watchFile(nativePath, () => {
                            if (fs.existsSync(nativePath)) {
                                restart()
                            }
                        })
                    }

                    if (childProcess) {
                        childProcess.kill()
                    }

                    childProcess = child_process.spawn(
                        'node',
                        ['--enable-source-maps', path.join(folder, 'server.js')],
                        {
                            cwd,
                            env: {
                                NODE_PATH: path.join(__dirname, '../node_modules'),
                            },
                            stdio: 'inherit',
                        }
                    )
                }
            })
        }

        break
    }
    case 'build': {
        const esbuildConfigGetter = getEsbuildConfigGetter(package, mode, cwd)

        // if (hasClient) {
        // }

        // if (hasServer) {
        // }

        break
    }
    case 'native': {
        if (hasClient) {
            const native = getWebNative(package, mode, cwd)
            native.build()
        }
        if (hasServer) {
            const native = getStandardNative(package, mode, cwd)
            native.configure()
            native.build()
        }
        break
    }
    default:
}

function getArgs() {
    let command = process.argv[2]
    let setMode = false
    let mode = 'production'
    process.argv.slice(3).forEach(arg => {
        if (setMode) {
            setMode = false
            mode = arg
            return
        }
        if (arg === '--mode') {
            setMode = true
            return
        }
    })
    return [command, mode]
}

function getModule(modulePath) {
    return JSON.parse(fs.readFileSync(modulePath).toString())
}

function getHtml(title, scripts) {
    return `
        <!DOCTYPE html>
        <html lang='ru'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>${title}</title>
        </head>
        <body>
            <div id='root'></div>
            <div id='modal-root'></div>
            ${scripts.map(script => `<script src='${script}'></script>`).join('')}
        </body>
        </html>
    `
}
