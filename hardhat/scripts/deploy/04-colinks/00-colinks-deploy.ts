import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const contractName = 'CoLinks';
  // TODO: add a different deployer for the colinks contract
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy the colinks implementation and proxy
  const colinks_deploy = await deploy(contractName, {
    contract: contractName,
    from: deployer,
    args: [],
    log: true,
  });
};

export default func;
func.id = 'deploy_colinks';
func.tags = ['DeployCoLinks', 'CoLinks'];
