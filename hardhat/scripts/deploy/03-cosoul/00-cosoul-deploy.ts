import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer, proxyAdmin } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const cosoul_implementation = await deploy('CoSoul', {
    contract: 'CoSoul',
    from: deployer,
    args: [],
    log: true,
  });

  // generate encoded data for proxy setup
  const types = ['string', 'string', 'address'];
  const values = ['CoSoul', 'soul', deployer];
  const abiCoder = new ethers.utils.AbiCoder();
  const encodedParams = abiCoder.encode(types, values);
  const functionSignature = 'initialize(string,string,address)';
  const functionSelector = ethers.utils.hexDataSlice(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(functionSignature)),
    0,
    4
  );
  const data = functionSelector + encodedParams.substr(2);

  await deploy('SoulProxy', {
    contract: 'SoulProxy',
    from: deployer,
    args: [cosoul_implementation.address, proxyAdmin, data],
    log: true,
  });
};
export default func;
func.id = 'deploy_cosoul';
func.tags = ['DeployCoSoul', 'CoSoul'];
