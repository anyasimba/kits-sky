/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')
const webpack = require('webpack')
const NodemonPlugin = require('nodemon-webpack-plugin')

module.exports = (package, mode, cwd, globalPackages) => {
    const resolve = {
        fallback: {},
        extensions: ['.ts', '.tsx', '.js'],
        modules: ['node_modules', cwd],
        alias: {
            sky: path.resolve(__dirname, '../src'),
            extensions: path.resolve(__dirname, '../extensions'),
        },
    }

    globalPackages.forEach(
        package =>
            (resolve.fallback[package] = path.resolve(
                execSync('npm root -g').toString().trim(),
                package
            ))
    )

    const rules = []
    if (mode === 'production') {
        rules.push({
            test: /\.tsx?$/,
            enforce: 'pre',
            use: ['cache-loader', 'eslint-loader'],
            exclude: ['/node_modules/', '/dist/'],
            include: [/src/, /extras/, cwd],
        })
    }
    rules.push(
        {
            test: /\.tsx?$/,
            use: [
                {
                    loader: 'cache-loader',
                    options: { cacheDirectory: path.resolve(__dirname, '../node_modules/.cache') },
                },
                'ts-loader',
            ],
            exclude: '/node_modules/',
            include: [/src/, /extras/, cwd],
        },
        {
            test: /\.css$/,
            use: [
                {
                    loader: 'cache-loader',
                    options: { cacheDirectory: path.resolve(__dirname, '../node_modules/.cache') },
                },
                'style-loader',
                'css-loader?modules',
            ],
            exclude: '/node_modules/',
            include: [/src/, /extras/, cwd],
        }
    )

    function getClientConfig() {
        let client
        if (fs.existsSync(path.join(cwd, 'client'))) {
            client = path.join(cwd, 'client')
        } else if (fs.existsSync(path.join(cwd, 'src'))) {
            client = path.join(cwd, 'src')
        } else {
            client = cwd
        }

        const app = ['webpack-hot-middleware/client', './extras/client']

        const globals = []

        if (package.client && package.client.native) {
            const nativePath = path.join(cwd, '.vscode/storage/native/web-native.js')
            globals.push(nativePath)
            app.push(nativePath)
            app.push('./bin/native/web/@include-native')
        }

        app.push(client)

        return {
            stats: 'minimal',
            mode,
            entry: {
                app,
            },
            resolve: {
                ...resolve,
                fallback: {
                    ...resolve.fallback,
                    fs: false,
                    path: false,
                },
            },
            context: path.resolve(__dirname, '../'),
            module: {
                rules: [
                    ...rules,
                    {
                        test: /\.js$/,
                        include: globals,
                        loader: 'script-loader',
                    },
                ],
            },
            target: 'web',
            output: {
                filename: 'app.js',
                path: path.resolve(cwd, 'dist'),
            },
            plugins: [new webpack.HotModuleReplacementPlugin()],
            devtool: 'source-map',
        }
    }

    function getServerConfig(outputDir) {
        let server
        if (fs.existsSync(path.join(cwd, 'server'))) {
            server = path.join(cwd, 'server')
        } else if (package.client === false) {
            if (fs.existsSync(path.join(cwd, 'src'))) {
                server = path.join(cwd, 'src')
            } else {
                server = cwd
            }
        }

        const app = ['./extras/server']
        if (package.server && package.server.native) {
            app.push(`./bin/native/standard/@include-native`)

            const native = `${cwd}/.vscode/storage/server-native/build/Release/native.node`
            const sync = () => {
                try {
                    console.log('wtf', native)
                    if (fs.existsSync(native)) {
                        console.log('copy', native, `${outputDir}/native.node`)
                        fs.copyFileSync(native, `${outputDir}/native.node`)
                    }
                } catch (e) {
                    //
                }
            }
            sync()
            fs.watchFile(native, sync)
        }
        app.push(server)

        return {
            stats: 'minimal',
            mode,
            entry: {
                app,
            },
            resolve,
            context: path.resolve(__dirname, '../'),
            module: { rules },
            target: 'node',
            externals: [
                ({ request }, callback) => {
                    try {
                        if (request.indexOf('native.node') !== -1) {
                            callback(null, 'commonjs ' + request)
                            return
                        }
                        const modulePath = require.resolve(request)
                        if (modulePath.indexOf('node_modules') !== -1) {
                            callback(null, 'commonjs ' + request)
                            return
                        }
                        callback()
                    } catch (err) {
                        callback()
                    }
                },
            ],
            output: {
                filename: 'server.js',
                path: outputDir,
            },
            plugins: [
                new NodemonPlugin({
                    env: {
                        NODE_PATH: path.resolve(__dirname, '../node_modules'),
                    },
                }),
            ],
            devtool: 'source-map',
        }
    }

    return {
        getClientConfig,
        getServerConfig,
    }
}
