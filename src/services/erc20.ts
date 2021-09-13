import { TransactionReceipt } from '@ethersproject/abstract-provider/lib/index';
import { BigNumber, Contract, Wallet, ethers, utils } from 'ethers';

import { getLogger } from 'utils/logger';
import { isAddress, isContract } from 'utils/tools';

import { Maybe } from 'types';

const logger = getLogger('Services::Erc20');

const erc20Abi = [
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function balanceOf(address marketMaker) external view returns (uint256)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)',
  'function decimals() external view returns (uint8)',
  'function transferFrom(address sender, address recipient, uint256 amount) public returns (bool)',
  'function transfer(address to, uint256 value) public returns (bool)',
  'function totalSupply() public view returns (uint)',
];

class ERC20Service {
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
        erc20Abi,
        provider
      ).connect(signer);
    } else {
      this.contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
    }
  }

  get address(): string {
    return this.contract.address;
  }

  /**
   * @returns A boolean indicating if `spender` has enough allowance to transfer `neededAmount` tokens from `spender`.
   */
  hasEnoughAllowance = async (
    owner: string,
    spender: string,
    neededAmount: BigNumber
  ): Promise<boolean> => {
    const allowance: BigNumber = await this.contract.allowance(owner, spender);
    return allowance.gte(neededAmount);
  };

  /**
   * @returns The allowance given by `owner` to `spender`.
   */
  allowance = async (owner: string, spender: string): Promise<BigNumber> => {
    return this.contract.allowance(owner, spender);
  };

  /**
   * Approve `spender` to transfer `amount` tokens on behalf of the connected user.
   */
  approve = async (
    spender: string,
    amount: BigNumber
  ): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.approve(spender, amount, {
      value: '0x0',
    });
    logger.log(`Approve transaction hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  /**
   * Approve `spender` to transfer an "unlimited" amount of tokens on behalf of the connected user.
   */
  approveUnlimited = async (spender: string): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.approve(
      spender,
      ethers.constants.MaxUint256,
      {
        value: '0x0',
      }
    );
    logger.log(`Approve unlimited transaccion hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  getBalanceOf = async (address: string): Promise<any> => {
    return this.contract.balanceOf(address);
  };

  totalSupply = async (): Promise<any> => {
    return this.contract.totalSupply();
  };

  hasEnoughBalanceToFund = async (
    owner: string,
    amount: BigNumber
  ): Promise<boolean> => {
    const balance: BigNumber = await this.contract.balanceOf(owner);

    return balance.gte(amount);
  };

  isValidErc20 = async (): Promise<boolean> => {
    try {
      if (!isAddress(this.contract.address)) {
        throw new Error('Is not a valid erc20 address');
      }

      if (!isContract(this.provider, this.contract.address)) {
        throw new Error('Is not a valid contract');
      }

      const [decimals, symbol] = await Promise.all([
        this.contract.decimals(),
        this.contract.symbol(),
      ]);

      return !!(decimals && symbol);
    } catch (err) {
      logger.error(err.message);
      return false;
    }
  };

  static encodeTransferFrom = (
    from: string,
    to: string,
    amount: BigNumber
  ): string => {
    const transferFromInterface = new utils.Interface(erc20Abi);

    return transferFromInterface.encodeFunctionData('transferFrom', [
      from,
      to,
      amount,
    ]);
  };

  static encodeTransfer = (to: string, amount: BigNumber): string => {
    const transferInterface = new utils.Interface(erc20Abi);

    return transferInterface.encodeFunctionData('transfer', [to, amount]);
  };

  static encodeApprove = (
    spenderAccount: string,
    amount: BigNumber
  ): string => {
    const approveInterface = new utils.Interface(erc20Abi);

    return approveInterface.encodeFunctionData('approve', [
      spenderAccount,
      amount,
    ]);
  };

  static encodeApproveUnlimited = (spenderAccount: string): string => {
    const approveInterface = new utils.Interface(erc20Abi);

    return approveInterface.encodeFunctionData('approve', [
      spenderAccount,
      ethers.constants.MaxUint256,
    ]);
  };
}

export { ERC20Service };
