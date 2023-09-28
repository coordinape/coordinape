/* eslint-disable no-console */
import { default as hre, ethers } from 'hardhat';

import { CoSoul__factory } from '../../typechain';

async function main() {
  const { deployer, pgiveSyncer } = await hre.getNamedAccounts();
  const deployed_cosoul = await hre.deployments.get('CoSoul');

  const deployerSigner = await ethers.getSigner(deployer);

  const cosoul = CoSoul__factory.connect(
    deployed_cosoul.address,
    deployerSigner
  );

  const totalSupply = await cosoul.totalSupply();
  console.log('totalSupply: ', totalSupply.toString());

  const data = await cosoul.tokenURI(13);
  console.log(`tokenURI for token 1: "${data}"`);

  const syncer_auth = await cosoul.authorisedCallers(pgiveSyncer);
  console.log(`pgiveSyncer ${pgiveSyncer} is authorized: `, syncer_auth);

  const proxy = await hre.deployments.get('DefaultProxyAdmin');
  const proxyContract = await ethers.getContractAt(proxy.abi, proxy.address);
  const proxyOwner = await proxyContract.owner();
  console.log('proxy admin owner: ', proxyOwner);

  // log the current setMintFei value
  const mintFei = await cosoul.mintFeeInWei();
  console.log('mintFei in wei: ', mintFei.toString());
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
