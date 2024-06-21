import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy('COToken', {
    contract: 'COToken',
    from: deployer,
    args: [],
    log: true,
  });
};
export default func;
func.id = 'deploy_ape_protocol';
func.tags = ['DeployApe', 'Ape'];
