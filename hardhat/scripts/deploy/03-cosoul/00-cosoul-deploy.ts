import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { CoSoul__factory } from '../../../typechain';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer, proxyAdmin, coSoulSigner, pgiveSyncer } =
    await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployerSigner = await ethers.getSigner(deployer);

  const cosoul_implementation = await deploy('CoSoul', {
    contract: 'CoSoul',
    from: deployer,
    args: [],
    log: true,
  });

  // generate encoded data for proxy setup
  const types = ['string', 'string', 'address'];
  const values = ['CoSoul', 'soul', coSoulSigner];
  const abiCoder = new ethers.utils.AbiCoder();
  const encodedParams = abiCoder.encode(types, values);
  const functionSignature = 'initialize(string,string,address)';
  const functionSelector = ethers.utils.hexDataSlice(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(functionSignature)),
    0,
    4
  );
  const data = functionSelector + encodedParams.substr(2);

  // TODO: set multisig as proxyAdmin for contracts
  const cosoul_proxy = await deploy('SoulProxy', {
    contract: 'SoulProxy',
    from: deployer,
    args: [cosoul_implementation.address, proxyAdmin, data],
    log: true,
  });

  const cosoul = CoSoul__factory.connect(
    cosoul_implementation.address,
    deployerSigner
  ).attach(cosoul_proxy.address);

  const setCaller = await cosoul.setCallers(pgiveSyncer, true);
  // eslint-disable-next-line no-console
  console.log(
    `cosoul.setCallers set to ${pgiveSyncer} via tx: `,
    setCaller.hash
  );
};
export default func;
func.id = 'deploy_cosoul';
func.tags = ['DeployCosoul', 'CoSoul'];
