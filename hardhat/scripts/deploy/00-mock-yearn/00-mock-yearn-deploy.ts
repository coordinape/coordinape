import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { TEST_ENV } from '../../../constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const useProxy = !hre.network.live;
  if (TEST_ENV) return !useProxy;

  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const yRegistry = await deploy('MockRegistry', {
    contract: 'MockRegistry',
    from: deployer,
    args: [],
    log: true,
  });
  await deploy('MockVaultFactory', {
    contract: 'MockVaultFactory',
    from: deployer,
    args: [yRegistry.address],
    log: true,
  });
  return !useProxy;
};
export default func;
func.id = 'deploy_mock_yearn_protocol';
func.tags = ['DeployMockYearn', 'MockYearn'];
