import { default as hre, deployments, ethers } from 'hardhat';

import { CoSoul__factory } from '../../typechain';

async function main() {
  const { deployer } = await hre.getNamedAccounts();
  const deployed_cosoul = await hre.deployments.get('CoSoul');

  const deployerSigner = await ethers.getSigner(deployer);

  const cosoul = CoSoul__factory.connect(
    deployed_cosoul.address,
    deployerSigner
  );

  const data = await cosoul.getBaseURI();

  console.log('baseUri: ', data);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
