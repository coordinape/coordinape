import assert from 'assert';

import { ethers, upgrades } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { CoSoul__factory, SoulProxy__factory } from '../../../typechain';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer, proxyAdmin, coSoulSigner, pgiveSyncer, contractOwner } =
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
  const initializeArgs = ['CoSoul', 'soul', coSoulSigner];
  const abiCoder = new ethers.utils.AbiCoder();
  const encodedParams = abiCoder.encode(types, initializeArgs);
  const functionSignature = 'initialize(string,string,address)';
  const functionSelector = ethers.utils.hexDataSlice(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(functionSignature)),
    0,
    4
  );
  const data = functionSelector + encodedParams.substr(2);

  console.log('deploying proxy');

  // const proxyFactory = await ethers.getContractFactory('SoulProxy');
  // const cosoulFactory = await ethers.getContractFactory('CoSoul');
  // const cosoul_proxy = await upgrades.deployProxy(
  //   cosoulFactory,
  //   initializeArgs,
  //   {
  //     // constructorArgs: [cosoul_implementation.address, proxyAdmin, data],
  //     kind: 'transparent',
  //   }
  // );
  // await cosoul_proxy.deployed();
  // console.log('CoSoul Proxy deployed to:', cosoul_proxy.address);

  // TODO: set multisig as proxyAdmin for contracts
  const cosoul_proxy = await deploy('SoulProxy', {
    contract: 'SoulProxy',
    from: deployer,
    args: [cosoul_implementation.address, proxyAdmin, data],
    log: true,
  });

  // eslint-disable-next-line no-console
  console.log(
    'deployed SoulProxy at: ',
    cosoul_proxy.address,
    'with args:',
    cosoul_implementation.address,
    proxyAdmin,
    data
  );

  const cosoul = CoSoul__factory.connect(
    cosoul_implementation.address,
    deployerSigner
  ).attach(cosoul_proxy.address);

  const setCallerTx = await cosoul.setCallers(pgiveSyncer, true);
  // eslint-disable-next-line no-console
  console.log(
    `cosoul.setCallers set to ${pgiveSyncer} via tx: `,
    setCallerTx.hash
  );

  const setOwnerTx = await cosoul.transferOwnership(contractOwner);
  // eslint-disable-next-line no-console
  console.log(
    `cosoul.transferOwnership set to ${contractOwner} via tx: `,
    setOwnerTx.hash
  );

  const baseUri = process.env.COSOUL_BASE_URI;
  assert(baseUri, 'env var COSOUL_BASE_URI not set');

  // testing with new owner
  const cosoul2 = CoSoul__factory.connect(
    cosoul_implementation.address,
    await ethers.getSigner(contractOwner)
  ).attach(cosoul_proxy.address);

  const setBaseTx = await cosoul2.setBaseURI(baseUri);
  // eslint-disable-next-line no-console
  console.log(`cosoul.setBaseURI set to ${baseUri} via tx: `, setBaseTx.hash);

  console.log('PROXY TIME');
  // log current proxy admin

  // Construct the data for the transfer
  const update_data = ethers.utils.hexConcat([
    '0x3659cfe6',
    ethers.utils.hexZeroPad(cosoul.address, 32),
  ]);

  // Call the transfer function
  const tx = await deployerSigner.sendTransaction({
    to: cosoul_proxy.address,
    data: update_data,
  });

  await tx.wait(); // Wait for the transaction to be mined

  // const proxy = SoulProxy__factory.connect(
  //   cosoul_implementation.address,
  //   await ethers.getSigner(deployer)
  // ).attach(cosoul_proxy.address);
};
export default func;
func.id = 'deploy_cosoul';
func.tags = ['DeployCosoul', 'CoSoul'];
