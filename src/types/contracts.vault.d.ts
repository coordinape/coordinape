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
  type: string;
  transactions: IVaultTransaction[];
}
