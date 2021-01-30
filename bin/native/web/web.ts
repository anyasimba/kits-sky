export default function (moduleConfig) {
    let unixWorkspacePath = path.normalize(workspacePath)
    unixWorkspacePath = workspacePath.replace(/\\/g, '/')
    
    const makefilePath = path.join(skyPath, 'extras/native/web/Makefile')

    const r = childProcess.spawnSync('mingw32-make', ['compile', '-f', makefilePath], {
        stdio: 'inherit',
        env: {
            ...process.env,
            PROJECT_PATH: unixWorkspacePath,
            PROJECT_NAME: moduleConfig.id,
        },
    })
    if (r.error) {
        console.error(r.error)
        process.exit(1)
    }
}
