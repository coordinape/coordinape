import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;
  const yearnRegistry = '0xE15461B18EE31b7379019Dc523231C57d1Cbc18c';
  const apeRegistry = await deploy('ApeRegistry', {
    contract: 'ApeRegistry',
    from: deployer,
    args: [0],
    log: true,
  });
  const apeVaultFactory = await deploy('ApeVaultFactory', {
    contract: 'ApeVaultFactory',
    from: deployer,
    args: [yearnRegistry, apeRegistry.address],
    log: true,
  });
  await deploy('ApeRouter', {
    contract: 'ApeRouter',
    from: deployer,
    args: [yearnRegistry, apeVaultFactory.address],
    log: true,
  });
  await deploy('ApeDistributor', {
    contract: 'ApeDistributor',
    from: deployer,
    args: [],
    log: true,
  });
  await deploy('FeeRegistry', {
    contract: 'FeeRegistry',
    from: deployer,
    args: [],
    log: true,
  });
  return !useProxy;
};
export default func;
func.id = 'deploy_ape_protocol';
func.tags = ['DeployApe', 'Ape'];
