import assert from 'assert';
import { default as hre, deployments, ethers } from 'hardhat';

import { CoSoul__factory } from '../../typechain';

async function main() {
  const { deployer, pgiveSyncer, contractOwner } = await hre.getNamedAccounts();

  const deployed_cosoul = await hre.deployments.get('CoSoul');

  const deployerSigner = await ethers.getSigner(deployer);

  const cosoul = CoSoul__factory.connect(
    deployed_cosoul.implementation || '',
    deployerSigner
  ).attach(deployed_cosoul.address);

  const setCallerTx = await cosoul.setCallers(pgiveSyncer, true);
  console.log(
    `cosoul.setCallers set to ${pgiveSyncer} via tx: `,
    setCallerTx.hash
  );

  const baseUri = process.env.COSOUL_BASE_URI;
  assert(baseUri, 'env var COSOUL_BASE_URI not set');
  const setBaseTx = await cosoul.setBaseURI(baseUri);
  console.log(`cosoul.setBaseURI set to ${baseUri} via tx: `, setBaseTx.hash);

  const setOwnerTx = await cosoul.transferOwnership(contractOwner);
  console.log(
    `cosoul.transferOwnership set to ${contractOwner} via tx: `,
    setOwnerTx.hash
  );
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
