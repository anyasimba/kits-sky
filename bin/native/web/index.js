const path = require('path')
const childProcess = require('child_process')

module.exports = (package, mode, cwd) => {
    function build() {
        let unixWorkspacePath = path.normalize(cwd)
        unixWorkspacePath = unixWorkspacePath.replace(/\\/g, '/')

        const makefilePath = path.resolve(__dirname, 'Makefile')

        const r = childProcess.spawnSync('mingw32-make', ['compile', '-f', makefilePath], {
            stdio: 'inherit',
            env: {
                ...process.env,
                ENGINE_PATH: path.resolve(__dirname, '../../../'),
                PROJECT_PATH: unixWorkspacePath,
                PROJECT_NAME: package.name,
            },
        })
        if (r.error) {
            console.error(r.error)
            process.exit(1)
        }
    }

    return {
        build,
    }
}