import { BigNumberish } from '@ethersproject/bignumber';
import { BytesLike } from '@ethersproject/bytes';
import { Overrides } from '@ethersproject/contracts';

export interface OverrideOnly {
  _overrides?: Overrides;
}
export interface CreateVault {
  _token: string;
  _simpleToken: string;
  _overrides?: Overrides;
}

export interface AddFunds {
  _amount: BigNumberish;
  _overrides?: Overrides;
}

export interface DepositSimpleToken {
  _amount: BigNumberish;
  _overrides?: Overrides;
}
export interface WithdrawUnderlying {
  _amount: BigNumberish;
  _overrides?: any;
}

export interface ApproveCircleAdmin {
  _circle: BytesLike;
  _admin: string;
  _overrides?: Overrides;
}

export interface ExitVaultToken {
  _underlying: boolean;
  _overrides?: Overrides;
}

export interface SetRegistry {
  _registry: string;
  _overrides?: Overrides;
}

export interface Tap {
  _value: BigNumberish;
  _type: BigNumberish;
  _overrides?: Overrides;
}

export interface TransferOwnership {
  _newOwner: string;
  _overrides?: Overrides;
}

export interface UpdateAllowance {
  _circle: BytesLike;
  _token: string;
  _amount: BigNumberish;
  _interval: BigNumberish;
  _epochAmount: BigNumberish;
  _overrides?: Overrides;
}

export interface ApeWithdraw {
  _shareAmount: BigNumberish;
  _underlying: boolean;
  _overrides?: Overrides;
}

export interface Schedule {
  _target: string;
  _data: BytesLike;
  _predecessor: BytesLike;
  _salt: BytesLike;
  _delay: BigNumberish;
  _overrides?: Overrides;
}

export interface GetVariableFee {
  _yield: BigNumberish;
  _tapTotal: BigNumberish;
  overrides?: Overrides;
}

export interface Execute {
  _target: string;
  _data: BytesLike;
  _predecessor: BytesLike;
  _salt: BytesLike;
  _delay: BigNumberish;
  _overrides?: Overrides;
}

export interface ChangeMinDelay {
  _min: BigNumberish;
  _overrides?: Overrides;
}

export interface Cancel {
  _id: BytesLike;
  _overrides?: Overrides;
}

export type Maybe<T> = T | undefined | null;
