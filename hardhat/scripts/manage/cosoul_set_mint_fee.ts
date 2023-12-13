/* eslint-disable no-console */

import { default as hre, ethers } from 'hardhat';

import { CoSoul__factory } from '../../typechain';

async function main() {
  const { pgiveSyncer } = await hre.getNamedAccounts();

  const deployed_cosoul = await hre.deployments.get('CoSoul');

  // use pgiveSyncer account - which has perms for setting mintFee
  const signer = await ethers.getSigner(pgiveSyncer);

  const cosoul = CoSoul__factory.connect(
    deployed_cosoul.implementation || '',
    signer
  ).attach(deployed_cosoul.address);

  // set mint fee
  const fee = ethers.utils.parseEther('0.0022');
  const setMintFeeTx = await cosoul.setMintFee(fee);
  console.log(
    `cosoul.setMintFee set to ${fee.toString()} wei via tx: `,
    setMintFeeTx.hash
  );
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
