import { TAssetEnum } from 'config/networks';

export interface IVaultTransaction {
  name: string;
  dateType: string;
  posNeg: '+' | '-';
  value: number;
  vaultName: string;
  number: number;
  activeUsers: number;
  date: string;
}

export interface IVault {
  id: string;
  tokenAddress: string;
  simpleTokenAddress: string;

  type: TAssetEnum;
  transactions: IVaultTransaction[];
  orgId: number;

  // note that this won't work anymore as a single field
  // if we start using vaults with both token & simpleToken
  decimals: number;
}
