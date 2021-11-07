import { BigNumberish } from '@ethersproject/bignumber';
import { BytesLike } from '@ethersproject/bytes';

export interface CreateVault {
  _token: string;
  _simpleToken: string;
  _overrides?: any;
}

export interface AddFunds {
  _amount: BigNumberish;
  _overrides?: any;
}

export interface DepositSimpleToken {
  _amount: BigNumberish;
  _overrides?: any;
}
export interface WithdrawUnderlying {
  _amount: BigNumberish;
  _overrides?: any;
}

export interface ApproveCircleAdmin {
  _circle: BytesLike;
  _admin: string;
  _overrides?: any;
}

export interface ExitVaultToken {
  _underlying: boolean;
  _overrides?: any;
}

export type Maybe<T> = T | undefined | null;
