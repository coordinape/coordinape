import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer, proxyAdmin, coSoulSigner } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const initializeArgs = ['CoSoul', 'soul', coSoulSigner];

  // Deploy the cosoul implementation and proxy
  const cosoul_deploy = await deploy('CoSoul', {
    contract: 'CoSoul',
    from: deployer,
    args: [],
    log: true,
    proxy: {
      proxyContract: 'OpenZeppelinTransparentProxy',
      owner: proxyAdmin,
      execute: {
        init: {
          methodName: 'initialize',
          args: initializeArgs,
        },
        // do nothing on proxy upgrade
        // onUpgrade: {
        //   methodName: 'BADDDD',
        //   args: [],
        // },
      },
    },
  });
};
export default func;
func.id = 'deploy_cosoul';
func.tags = ['DeployCosoul', 'CoSoul'];
