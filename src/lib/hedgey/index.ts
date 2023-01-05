import { ERC20 } from '@coordinape/hardhat/dist/typechain';
import { BigNumber, ethers } from 'ethers';

import { DebugLogger } from '../../common-lib/log';
import { Contracts } from '../vaults';

import BatchNFTMinter from './BatchNFTMinter.json';

export const INTEGRATION_TYPE = 'hedgey';

const logger = new DebugLogger('hedgey');

export const lockedTokenDistribution = async (
  provider: ethers.providers.JsonRpcProvider,
  contracts: Contracts,
  token: ERC20,
  amount: BigNumber,
  hedgeyLockPeriod: string | undefined,
  hedgeyTransferable: string | undefined,
  balances: { address: string; earnings: string }[]
): Promise<any> => {
  logger.log('lockedTokenDistribution');
  const signer = provider.getSigner();
  const signerAddress = await signer.getAddress();
  const tokenAddress = token.address;

  const deploymentInfo = contracts.getDeploymentInfo();

  const allowance: BigNumber = await token.allowance(
    signerAddress,
    deploymentInfo.HedgeyLockedTokenDistribution.address
  );

  if (allowance.lt(amount)) {
    const transaction = await token.approve(
      deploymentInfo.HedgeyLockedTokenDistribution.address,
      amount
    );
    await transaction.wait();
  }

  const batchNFTMinter = new ethers.Contract(
    deploymentInfo.HedgeyLockedTokenDistribution.address,
    BatchNFTMinter.abi,
    provider.getSigner()
  );

  const holders: string[] = [];
  const amounts: string[] = [];
  const unlockDates: string[] = [];

  const now = new Date();
  const unlockDate = new Date(
    now.setMonth(now.getMonth() + Number(hedgeyLockPeriod))
  );
  const unlockSecondsSinceEpoch = Math.round(
    unlockDate.getTime() / 1000
  ).toString();

  balances.forEach(balance => {
    const amount = balance.earnings;
    holders.push(balance.address);
    amounts.push(amount);
    unlockDates.push(unlockSecondsSinceEpoch);
  });

  const mintFunction =
    batchNFTMinter[
      'batchMint(address,address[],address,uint256[],uint256[],uint256)'
    ];

  const productType = 2;

  const args = [
    hedgeyTransferable === '1'
      ? deploymentInfo.HedgeyTransferableNft.address
      : deploymentInfo.HedgeyNonTransferableNft.address,
    holders,
    tokenAddress,
    amounts,
    unlockDates,
    productType,
  ];
  logger.log(args);
  return mintFunction(...args);
};
