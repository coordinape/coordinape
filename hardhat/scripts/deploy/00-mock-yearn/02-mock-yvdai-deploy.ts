import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { MockRegistry__factory } from '../../../typechain';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;

  const signer = await ethers.getSigner(deployer);
  const yRegistry = MockRegistry__factory.connect(
    (await hre.deployments.get('MockRegistry')).address,
    signer
  );

  const dai = await deploy('DAI', {
    contract: 'MockToken',
    from: deployer,
    args: ['Dai Stablecoin', 'DAI'],
    log: true,
  });

  // Note: We aren't using the MockVaultFactory.createVault() method here because
  // deploymentInfo won't track any transactions that create new contracts.
  // So, we are manually deploying the Vault and registering it with the MockRegistry.
  const yvDAI = await deploy('yvDAI', {
    contract: 'MockVault',
    from: deployer,
    args: [dai.address, 'DAI yVault', 'yvDAI'],
  });

  await yRegistry.addVault(dai.address, yvDAI.address);
  return !useProxy;
};
export default func;
func.id = 'deploy_mock_yvdai';
func.tags = ['DeployMockYvDAI', 'MockYvDAI'];
