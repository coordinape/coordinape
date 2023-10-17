import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const WEI = 0.000000001;
const FIVE_PERCENT_IN_WEI = (1.0 / WEI) * 0.05;

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const contractName = 'SoulKeys';
  console.log('deploying', 1);
  // TODO: add a different deployer for the soulkeys contract
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log('deploying', deployer);
  // Deploy the cosoul implementation and proxy
  const soulkeys_deploy = await deploy(contractName, {
    contract: contractName,
    from: deployer,
    args: [],
    log: true,
  });
  console.log('deploying', 3);
  console.log('deployed soul_keys', !!soulkeys_deploy);

  const soulKeys = await deploy.get('SoulKeys');
  await soulKeys.setSubjectFeePercent(FIVE_PERCENT_IN_WEI);
  await soulKeys.setFeeDestination(deployer);
  await soulKeys.setProtocolFeePercent(FIVE_PERCENT_IN_WEI);
};

export default func;
func.id = 'deploy_soulkeys';
func.tags = ['DeploySoulKeys', 'SoulKeys'];
