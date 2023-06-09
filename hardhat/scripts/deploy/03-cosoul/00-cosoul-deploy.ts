import assert from 'assert';

import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { CoSoul__factory, SoulProxy__factory } from '../../../typechain';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer, proxyAdmin, coSoulSigner, pgiveSyncer, contractOwner } =
    await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployerSigner = await ethers.getSigner(deployer);

  const proxy_artifact = await hre.artifacts.readArtifact('SoulProxy');

  // generate encoded data for proxy setup
  // const types = ['string', 'string', 'address'];
  const initializeArgs = ['CoSoul', 'soul', coSoulSigner];
  // // const initializeArgs = ['CoSoul', 'soul', coSoulSigner];
  // const abiCoder = new ethers.utils.AbiCoder();
  // const encodedParams = abiCoder.encode(types, initializeArgs);
  // const functionSignature = 'initialize(string,string,address)';
  // const functionSelector = ethers.utils.hexDataSlice(
  //   ethers.utils.keccak256(ethers.utils.toUtf8Bytes(functionSignature)),
  //   0,
  //   4
  // );
  // const data = functionSelector + encodedParams.substr(2);

  console.log('deploying cosoul with', {
    cosoulsigner: coSoulSigner,
    proxyAdmin: proxyAdmin,
    deployer: deployer,
    initializeArgs: initializeArgs,
  });
  // Deploy the cosoul implementation and proxy
  const cosoul_deploy = await deploy('CoSoul', {
    contract: 'CoSoul',
    from: deployer,
    args: [],
    log: true,
    proxy: {
      proxyContract: 'OpenZeppelinTransparentProxy', //proxy_artifact,
      owner: proxyAdmin,
      execute: {
        // methodName: 'initialize',
        // args: initializeArgs,
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

  console.log('deployed CoSoul', { cosoul_deploy });

  // console.log('deploying proxy');

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
  // const cosoul_proxy = await deploy('SoulProxy', {
  //   contract: 'SoulProxy',
  //   from: deployer,
  //   args: [cosoul_implementation.address, proxyAdmin, data],
  //   log: true,
  // });

  // eslint-disable-next-line no-console
  // console.log(
  //   'deployed SoulProxy at: ',
  //   cosoul_proxy.address,
  //   'with args:',
  //   cosoul_implementation.address,
  //   proxyAdmin,
  //   data
  // );

  // const cosoul = CoSoul__factory.connect(
  //   cosoul_deploy.implementation || '',
  //   deployerSigner
  // ).attach(cosoul_deploy.address);

  // const setCallerTx = await cosoul.setCallers(pgiveSyncer, true);
  // console.log(
  //   `cosoul.setCallers set to ${pgiveSyncer} via tx: `,
  //   setCallerTx.hash
  // );

  // const baseUri = process.env.COSOUL_BASE_URI;
  // assert(baseUri, 'env var COSOUL_BASE_URI not set');
  // const setBaseTx = await cosoul.setBaseURI(baseUri);
  // console.log(`cosoul.setBaseURI set to ${baseUri} via tx: `, setBaseTx.hash);

  // const setOwnerTx = await cosoul.transferOwnership(contractOwner);
  // console.log(
  //   `cosoul.transferOwnership set to ${contractOwner} via tx: `,
  //   setOwnerTx.hash
  // );

  // console.log('Succesfully deploy Cosoul', {
  //   cosoul_implementation: cosoul_deploy.implementation,
  //   cosoul_proxy: cosoul_deploy.address,
  //   baseUri: cosoul,
  //   syncer: pgiveSyncer,
  //   cosoul_owner:
  //   cosoul_signer:
  //   proxy_admin:
  // });

  // const setBaseTx = await cosoul2.setBaseURI(baseUri);
  // // eslint-disable-next-line no-console
  // console.log(`cosoul.setBaseURI set to ${baseUri} via tx: `, setBaseTx.hash);

  // console.log('PROXY TIME');
  // // log current proxy admin

  // const new_cosoul = await deploy('CoSoul', {
  //   contract: 'CoSoul',
  //   from: contractOwner,
  //   args: [],

  //   log: true,
  // });

  // // Construct the data for the transfer
  // const update_data = ethers.utils.hexConcat([
  //   '0x3659cfe6',
  //   ethers.utils.hexZeroPad(new_cosoul.address, 32),
  // ]);

  // const proxyAdminSigner = await ethers.getSigner(proxyAdmin);

  // // Call the transfer function
  // const tx = await proxyAdminSigner.sendTransaction({
  //   to: cosoul_proxy.address,
  //   data: update_data,
  // });

  // await tx.wait(); // Wait for the transaction to be mined

  // console.log({ tx });

  // const proxy = SoulProxy__factory.connect(
  //   cosoul_implementation.address,
  //   await ethers.getSigner(deployer)
  // ).attach(cosoul_proxy.address);
};
export default func;
func.id = 'deploy_cosoul';
func.tags = ['DeployCosoul', 'CoSoul'];
