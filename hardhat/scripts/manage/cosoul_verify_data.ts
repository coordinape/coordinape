import { default as hre, ethers } from 'hardhat';

import { CoSoul__factory } from '../../typechain';

async function main() {
  const { deployer } = await hre.getNamedAccounts();
  const deployed_cosoul = await hre.deployments.get('CoSoul');

  const deployerSigner = await ethers.getSigner(deployer);

  const cosoul = CoSoul__factory.connect(
    deployed_cosoul.address,
    deployerSigner
  );

  const totalSupply = await cosoul.totalSupply();
  console.log('totalSupply: ', totalSupply.toString());

  const data = await cosoul.tokenURI(1);
  console.log(`tokenURI for token 1: "${data}"`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
