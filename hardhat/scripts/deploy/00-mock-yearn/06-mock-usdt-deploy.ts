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

  const usdt = await deploy('USDT', {
    contract: 'MockToken',
    from: deployer,
    args: ['Tether USD', 'USDT'],
    log: true,
  });

  // Note: We aren't using the MockVaultFactory.createVault() method here because
  // deploymentInfo won't track any transactions that create new contracts.
  // So, we are manually deploying the Vault and registering it with the MockRegistry.
  const yvUSDT = await deploy('yvUSDT', {
    contract: 'MockVault',
    from: deployer,
    args: [usdt.address, 'USDT yVault', 'yvUSDT'],
  });

  await yRegistry.addVault(usdt.address, yvUSDT.address);
  return !useProxy;
};
export default func;
func.id = 'deploy_mock_yvusdt';
func.tags = ['DeployMockYvUSDT', 'MockYvUSDT'];
