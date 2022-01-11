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
  decimals: number;
  type: TAssetEnum;
  transactions: IVaultTransaction[];
  orgId: number;
}
