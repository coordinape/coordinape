"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDeploymentInfo = exports.createDeploymentInfo = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function createDeploymentInfo(root) {
    const deploymentInfo = {};
    if (!fs_1.default.existsSync(path_1.default.join(root, '.chainId'))) {
        throw new Error(`No .chainId file found in ${root} directory`);
    }
    const chainId = fs_1.default.readFileSync(path_1.default.join(root, '.chainId')).toString();
    const files = fs_1.default.readdirSync(root, { withFileTypes: true });
    for (const file of files) {
        if (file.isFile() && path_1.default.extname(file.name) === '.json') {
            const deployment = JSON.parse(fs_1.default.readFileSync(path_1.default.join(root, file.name)).toString());
            const contractName = path_1.default.basename(file.name, '.json');
            deploymentInfo[chainId] = {
                ...deploymentInfo[chainId],
                [contractName]: { address: deployment['address'] },
            };
        }
    }
    return deploymentInfo;
}
exports.createDeploymentInfo = createDeploymentInfo;
function generateDeploymentInfo() {
    const projectRoot = path_1.default.join(__dirname, '..');
    const root = path_1.default.join(projectRoot, 'deployments');
    if (!fs_1.default.existsSync(root)) {
        console.error(`deployments directory doesn't exist! Please deploy to a chain first.`);
        process.exit(1);
    }
    let deploymentInfo = {};
    fs_1.default.readdirSync(root, { withFileTypes: true }).forEach((dirent) => {
        deploymentInfo = {
            ...deploymentInfo,
            ...createDeploymentInfo(path_1.default.join(root, dirent.name)),
        };
    });
    const outputPath = path_1.default.join(projectRoot, 'deploymentInfo.json');
    if (fs_1.default.existsSync(outputPath)) {
        const oldDeploymentInfo = JSON.parse(fs_1.default.readFileSync(outputPath).toString());
        deploymentInfo = { ...oldDeploymentInfo, ...deploymentInfo };
    }
    fs_1.default.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
}
exports.generateDeploymentInfo = generateDeploymentInfo;
generateDeploymentInfo();
