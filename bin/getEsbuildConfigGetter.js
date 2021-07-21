/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fs = require('fs')
const { nodeExternalsPlugin } = require('esbuild-node-externals')

module.exports = (package, mode, cwd) => {
    function getClientConfig() {
        let client
        if (fs.existsSync(path.join(cwd, 'client/index.ts'))) {
            client = path.join(cwd, 'client/index.ts')
        } else if (fs.existsSync(path.join(cwd, 'src/index.ts'))) {
            client = path.join(cwd, 'src/index.ts')
        } else {
            client = path.join(cwd, 'index.ts')
        }

        const inject = [path.join(__dirname, '../extras/client/index.ts')]

        if (package.client && package.client.native) {
            inject.push(path.join(cwd, '.vscode/storage/web-native.js'))
            inject.push(path.join(__dirname, 'native/web/@include-native.js'))
        }

        return {
            entryPoints: [client],
            bundle: true,
            outfile: path.join(cwd, 'dist/client', 'app.js'),
            inject,
            sourcemap: 'external',
            sourcesContent: false,
        }
    }

    function getServerConfig(outputDir) {
        let server
        if (fs.existsSync(path.join(cwd, 'server/index.ts'))) {
            server = path.join(cwd, 'server/index.ts')
        } else if (package.client === false) {
            if (fs.existsSync(path.join(cwd, 'src/index.ts'))) {
                server = path.join(cwd, 'src/index.ts')
            } else {
                server = path.join(cwd, 'index.ts')
            }
        }

        const inject = [path.join(__dirname, '../extras/server/index.ts')]
        if (package.server && package.server.native) {
            inject.push(path.join(__dirname, 'native/standard/@include-native.js'))
        }

        const nativePath = path
            .normalize(`${cwd}/.vscode/storage/server-native/build/Release/native.node`)
            .replace(/\\/g, '/')

        return {
            platform: 'node',
            entryPoints: [server],
            bundle: true,
            outfile: path.join(outputDir, 'server.js'),
            inject,
            sourcemap: 'external',
            sourcesContent: false,
            plugins: [nodeExternalsPlugin()],
            external: [nativePath],
            define: {
                ___NATIVE_PATH: `"${nativePath}"`,
            },
            nodePaths: [path.join(__dirname, '../node_modules')],
        }
    }

    return {
        getClientConfig,
        getServerConfig,
    }
}
