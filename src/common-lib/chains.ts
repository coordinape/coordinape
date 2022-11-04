import deploymentInfo from '@coordinape/hardhat/dist/deploymentInfo.json';
const requiredContracts = ['ApeVaultFactory', 'ApeRouter', 'ApeDistributor'];

export const vaultsSupportedChainIds: string[] = Object.entries(deploymentInfo)
  .filter(([, contracts]) => requiredContracts.every(c => c in contracts))
  .map(x => x[0].toString());
