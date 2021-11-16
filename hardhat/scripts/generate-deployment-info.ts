import fs from 'fs';
import path from 'path';

export type DeployedContracts = {
  [contractName: string]: {
    address: string;
  };
};

export type DeploymentInfo = {
  [chainId: string]: DeployedContracts;
};

export function createDeploymentInfo(root: string): DeploymentInfo {
  const deploymentInfo: DeploymentInfo = {};

  if (!fs.existsSync(path.join(root, '.chainId'))) {
    throw new Error(`No .chainId file found in ${root} directory`);
  }
  const chainId = fs.readFileSync(path.join(root, '.chainId')).toString();

  const files = fs.readdirSync(root, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.json') {
      const deployment = JSON.parse(
        fs.readFileSync(path.join(root, file.name)).toString()
      );
      const contractName = path.basename(file.name, '.json');
      deploymentInfo[chainId] = {
        ...deploymentInfo[chainId],
        [contractName]: { address: deployment['address'] },
      };
    }
  }

  return deploymentInfo;
}

export function generateDeploymentInfo(): void {
  const projectRoot = path.join(__dirname, '..');
  const root = path.join(projectRoot, 'deployments');
  if (!fs.existsSync(root)) {
    throw new Error(
      `deployments directory doesn't exist! Please deploy to a chain first.`
    );
  }
  let deploymentInfo: DeploymentInfo = {};

  fs.readdirSync(root, { withFileTypes: true }).forEach((dirent: fs.Dirent) => {
    deploymentInfo = {
      ...deploymentInfo,
      ...createDeploymentInfo(path.join(root, dirent.name)),
    };
  });

  fs.writeFileSync(
    path.join(projectRoot, 'deploymentInfo.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );
}

generateDeploymentInfo();
