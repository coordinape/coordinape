import { TransactionReceipt } from '@ethersproject/abstract-provider/lib/index';
import { BigNumber, Contract, Wallet, ethers } from 'ethers';

import { getLogger } from 'utils/logger';

import { Maybe } from 'types';

const logger = getLogger('Services::StakeService');

const stakingAbi = [
  'function balanceOf(address marketMaker) external view returns (uint256)',
  'function totalStakedFor(address addr) public view returns (uint256)',
  'function totalStaked() public view returns (uint256)',
  'function stake(uint256 amount, bytes calldata data) external',
  'function unstake(uint256 amount, bytes calldata data) external',
  'function token() external view returns (address)',
];

class StakeService {
  provider: any;
  contract: Contract;

  constructor(
    provider: any,
    signerAddress: Maybe<string>,
    tokenAddress: string
  ) {
    this.provider = provider;
    if (signerAddress) {
      const signer: Wallet = provider.getSigner();
      this.contract = new ethers.Contract(
        tokenAddress,
        stakingAbi,
        provider
      ).connect(signer);
    } else {
      this.contract = new ethers.Contract(tokenAddress, stakingAbi, provider);
    }
  }

  get address(): string {
    return this.contract.address;
  }

  getBalanceOf = async (address: string): Promise<any> => {
    return this.contract.balanceOf(address);
  };

  getTotalStackedFor = async (address: string): Promise<any> => {
    return this.contract.totalStakedFor(address);
  };

  getTotalStacked = async (): Promise<any> => {
    return this.contract.totalStaked();
  };

  totalSupply = async (): Promise<any> => {
    return this.contract.totalSupply();
  };

  unstake = async (amount: BigNumber): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.unstake(amount, '0x');

    return this.provider.waitForTransaction(transactionObject.hash);
  };

  stake = async (amount: BigNumber): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.stake(amount, '0x');
    logger.log(`stake transaction hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };
}

export { StakeService };
