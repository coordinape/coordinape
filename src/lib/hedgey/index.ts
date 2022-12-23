import { ERC20 } from '@coordinape/hardhat/dist/typechain';
import { BigNumber, ethers } from 'ethers';
import { Contracts } from 'lib/vaults';

import BatchNFTMinter from './BatchNFTMinter.json';

export const INTEGRATION_TYPE = 'hedgey';

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

  const deploymentInfo = contracts.getDeploymentInfo();

  const allowance: BigNumber = await token.allowance(
    signerAddress,
    deploymentInfo.HedgeyLockedTokenDistribution.address
  );

  if (allowance.lt(amount)) {
    await token.approve(
      deploymentInfo.HedgeyLockedTokenDistribution.address,
      amount
    );
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

  return mintFunction(
    hedgeyTransferable === '1'
      ? deploymentInfo.HedgeyTransferableNft.address
      : deploymentInfo.HedgeyNonTransferableNft.address,
    holders,
    tokenAddress,
    amounts,
    unlockDates,
    2
  );
};
