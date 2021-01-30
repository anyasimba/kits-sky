import Module from '../workspace/Module'
import workspaceConfig from '../workspace/thisWorkspaceConfig'
import web from './web'

export default function (command: string, module: string) {
    if (command === 'build') {
        const moduleConfig = Module(module, workspacePath, workspaceConfig)
        if (moduleConfig.web) {
            web(moduleConfig)
        }
    }
}
