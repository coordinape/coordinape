import { ERC20 } from '@coordinape/hardhat/dist/typechain';
import { BigNumber, ethers } from 'ethers';
import { Contracts } from 'lib/vaults';

import BatchNFTMinter from './BatchNFTMinter.json';

export const lockedTokenDistribution = async (
  provider: ethers.providers.JsonRpcProvider,
  contracts: Contracts,
  token: ERC20,
  amount: BigNumber,
  hedgeyLockPeriod: number,
  hedgeyTransferable: string,
  balances: { address: string; earnings: string }[]
): Promise<any> => {
  const signer = provider.getSigner();
  const signerAddress = await signer.getAddress();
  const tokenAddress = token.address;

  const hedgeyLockedTokenDistribution =
    '0xb3d4efe7ecf102afcd3262cf4d5fc768d0c55459';
  const hedgeyTransferableNft = '0x2aa5d15eb36e5960d056e8fea6e7bb3e2a06a351';
  const hedgeyNonTransferableNft = '0x7251ce9c84afc96c20ca1b89f8e5ff8ee593db8f';

  const allowance: BigNumber = await token.allowance(
    signerAddress,
    hedgeyLockedTokenDistribution
  );

  if (allowance.lt(amount)) {
    await token.approve(hedgeyLockedTokenDistribution, amount);
  }

  const batchNFTMinter = new ethers.Contract(
    hedgeyLockedTokenDistribution,
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

  return batchNFTMinter.batchMint(
    hedgeyTransferable === '1'
      ? hedgeyTransferableNft
      : hedgeyNonTransferableNft,
    holders,
    tokenAddress,
    amounts,
    unlockDates
  );
};
