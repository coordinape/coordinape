/* eslint-disable no-console */

import { BigNumber } from 'ethers';
import { default as hre, ethers } from 'hardhat';

import { CoLinks__factory } from '../../typechain';

// const WEI = 0.000000001;
const FIVE_PERCENT_IN_WEI = BigNumber.from('50000000000000000'); // (1.0 / WEI) * 0.05;

async function main() {
  try {
    const { deployer, feeDestination } = await hre.getNamedAccounts();

    const deployed_colinks = await hre.deployments.get('CoLinks');

    // use deployer account - which has perms for setting the fees
    const signer = await ethers.getSigner(deployer);

    const coLinks = CoLinks__factory.connect(
      deployed_colinks.implementation || '',
      signer
    ).attach(deployed_colinks.address);

    // set mint fee
    const setFeeTx = await coLinks.setFeeDestination(feeDestination);

    console.log(
      `coLinks.setFeeDestination set to: `,
      feeDestination,
      ' with tx: ',
      setFeeTx.hash
    );

    const setProtocolFeeTx = await coLinks.setProtocolFeePercent(
      FIVE_PERCENT_IN_WEI
    );
    console.log(
      'setProtocolFee to ',
      FIVE_PERCENT_IN_WEI,
      ' with tx: ',
      setProtocolFeeTx.hash
    );
    const setTargetFeeTx = await coLinks.setTargetFeePercent(
      FIVE_PERCENT_IN_WEI
    );
    console.log(
      'setTargetFee to ',
      FIVE_PERCENT_IN_WEI,
      ' with tx: ',
      setTargetFeeTx.hash
    );
  } catch (e) {
    console.log(e);
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});