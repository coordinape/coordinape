import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { TEST_ENV } from '../../../constants';
import { MockRegistry__factory } from '../../../typechain';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const useProxy = !hre.network.live;
  if (TEST_ENV) return !useProxy;

  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const signer = await ethers.getSigner(deployer);
  const yRegistry = MockRegistry__factory.connect(
    (await hre.deployments.get('MockRegistry')).address,
    signer
  );

  const yfi = await deploy('YFI', {
    contract: 'MockToken',
    from: deployer,
    args: ['yearn.finance', 'YFI'],
    log: true,
  });

  // Note: We aren't using the MockVaultFactory.createVault() method here because
  // deploymentInfo won't track any transactions that create new contracts.
  // So, we are manually deploying the Vault and registering it with the MockRegistry.
  const yvYFI = await deploy('yvYFI', {
    contract: 'MockVault',
    from: deployer,
    args: [yfi.address, 'YFI yVault', 'yvYFI'],
  });

  await yRegistry.addVault(yfi.address, yvYFI.address);
  return !useProxy;
};
export default func;
func.id = 'deploy_mock_yvyfi';
func.tags = ['DeployMockYvYFI', 'MockYvYFI'];
