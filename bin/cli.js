#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fs = require('fs')
const os = require('os')
const webpack = require('webpack')
const express = require('express')
const getWebpackConfigGetter = require('./getWebpackConfigGetter')
const getStandardNative = require('./native/standard')
const getWebNative = require('./native/web')

const globalPackages = ['sky']
const [command, mode] = getArgs()
const cwd = process.cwd()

const package = getModule(path.join(cwd, 'package.json'))
const hasClient = package.client !== false
const hasServer = package.server || package.client === false

switch (command) {
    case 'start': {
        const webpackConfigGetter = getWebpackConfigGetter(package, mode, cwd, globalPackages)

        if (hasClient) {
            const app = express()
            const config = webpackConfigGetter.getClientConfig()
            const compiler = watchConfig(config)
            app.use(
                require('webpack-dev-middleware')(compiler, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                        'Access-Control-Allow-Headers':
                            'X-Requested-With, content-type, Authorization',
                    },
                })
            )

            app.use(require('webpack-hot-middleware')(compiler))
            app.get('/', (req, res) => {
                res.send(getHtml(module['html:title'], ['/app.js']))
            })
            app.listen(3019)
        }

        if (hasServer) {
            fs.mkdtemp(path.join(os.tmpdir()), (err, folder) => {
                if (err) throw err
                watchConfig(webpackConfigGetter.getServerConfig(folder))
            })
        }

        break
    }
    case 'build': {
        const webpackConfigGetter = getWebpackConfigGetter(package, mode, cwd, globalPackages)

        if (hasClient) {
            runConfig(webpackConfigGetter.getClientConfig())
        }

        if (hasServer) {
            runConfig(webpackConfigGetter.getServerConfig())
        }

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

function watchConfig(config) {
    const compiler = webpack(config)
    compiler.watch(
        {
            ignored: /node_modules/,
        },
        function (err, _stats) {
            if (err) {
                // eslint-disable-next-line no-console
                console.error(err)
                return
            }
            process.stdout.write(`${_stats.toString(stats)}\n`)
        }
    )
    return compiler
}

function runConfig(config) {
    const compiler = webpack(config)
    compiler.run((err, _stats) => {
        if (err) {
            // eslint-disable-next-line no-console
            console.error(err)
            return
        }
        process.stdout.write(`${_stats.toString(stats)}\n`)
    })
    return compiler
}

const stats = {
    hash: false,
    version: false,
    children: true,
    assets: false,
    chunks: false,
    entrypoints: false,
    modules: false,
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
            ${scripts.map(script => `<script src='${script}'></script>`).join('')}
        </body>
        </html>
    `
}
