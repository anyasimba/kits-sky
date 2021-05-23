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
            use: ['eslint-loader'],
            exclude: ['/node_modules/', '/dist/'],
            include: [/src/, /extras/, cwd],
        })
    }
    rules.push(
        {
            test: /\.tsx?$/,
            use: [
                'ts-loader',
                path.join(__dirname, 'autoSyncLoader'),
                {
                    loader: 'cache-loader',
                    options: { cacheDirectory: path.resolve(__dirname, '../node_modules/.cache') },
                },
            ],
            exclude: '/node_modules/',
            include: [/src/, /extras/, cwd],
        },
        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader?modules',
                {
                    loader: 'cache-loader',
                    options: { cacheDirectory: path.resolve(__dirname, '../node_modules/.cache') },
                },
            ],
            exclude: '/node_modules/',
            include: [/src/, /extras/, cwd],
        }
    )

    function getClientConfig() {
        let client
        if (fs.existsSync(path.join(cwd, 'src'))) {
            client = path.join(cwd, 'src')
        } else {
            client = cwd
        }

        return {
            stats: 'minimal',
            mode,
            entry: {
                app: ['webpack-hot-middleware/client', './extras/client', client],
            },
            resolve,
            context: path.resolve(__dirname, '../'),
            module: { rules },
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

        return {
            stats: 'minimal',
            mode,
            entry: {
                app: ['./extras/server', server],
            },
            resolve,
            context: path.resolve(__dirname, '../'),
            module: { rules },
            target: 'node',
            externals: [
                ({ request }, callback) => {
                    try {
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
