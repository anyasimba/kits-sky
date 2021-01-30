// export function configure () {
//     const config = {
//         targets: [
//             {
//                 target_name: 'native',
//                 include_dirs: [
//                     path.normalize(`${skyPath}`),
//                     path.normalize(`${workspacePath}/`),
//                 ],
//                 sources: [],
//             },
//         ],
//     }
//     fs.forEachDir(path.resolve(__dirname, '../../../src/native'), /\.cc$/, filePath => {
//         config.targets[0].sources.push(filePath)
//     })
//     fs.forEachDir(`${workspacePath}/shared/`, /\.cc$/, filePath => {
//         config.targets[0].sources.push(filePath)
//     })
//     fs.forEachDir(`${workspacePath}/server/`, /\.cc$/, filePath => {
//         config.targets[0].sources.push(filePath)
//     })
    
//     fs.writeFileSync(`${workspacePath}/_build/server/binding.gyp`, JSON.stringify(config, null, 4))

//     const nodeGyp = path.normalize('node_modules/.bin/node-gyp.cmd')
//     const buildDir = path.normalize(`${workspacePath}/_build/server/`)
//     let r = spawnSync(nodeGyp, ['-j', 'max', '--release', '-C', buildDir, 'clean'], {
//         stdio: 'inherit',
//     })
//     if (r.error) {
//         console.error(r.error)
//         process.exit(1)
//     }
//     r = spawnSync(nodeGyp, ['-j', 'max', '--release', '-C', buildDir, 'configure'], {
//         stdio: 'inherit',
//     })
//     if (r.error) {
//         console.error(r.error)
//         process.exit(1)
//     }
// }

// export function build () {
//     const nodeGyp = path.normalize('node_modules/.bin/node-gyp.cmd')
//     const buildDir = path.normalize(`${workspacePath}/_build/server/`)
//     let r = spawnSync(nodeGyp, ['-j', 'max', '--release', '-C', buildDir, 'build'], {
//         stdio: 'inherit',
//     })
//     if (r.error) {
//         console.error(r.error)
//         process.exit(1)
//     }
// }
