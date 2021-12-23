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

  const alusd = await deploy('alUSD', {
    contract: 'MockToken',
    from: deployer,
    args: ['alUSD', 'alUSD'],
    log: true,
  });

  // Note: We aren't using the MockVaultFactory.createVault() method here because
  // deploymentInfo won't track any transactions that create new contracts.
  // So, we are manually deploying the Vault and registering it with the MockRegistry.
  const yvalUSD = await deploy('yvalUSD', {
    contract: 'MockVault',
    from: deployer,
    args: [alusd.address, 'alUSD yVault', 'yvalUSD'],
  });

  await yRegistry.addVault(alusd.address, yvalUSD.address);
  return !useProxy;
};
export default func;
func.id = 'deploy_mock_yvalusd';
func.tags = ['DeployMockYvalUSD', 'MockYvalUSD'];
