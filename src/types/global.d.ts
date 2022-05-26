import { BigNumber } from 'ethers';

export type Maybe<T> = T | null;

export interface ITableColumn {
  label: string;
  tooltip?: string;
  tooltipMoreUrl?: string;
  accessor?: string;
  render?: (obj: GenericObject) => React.ReactNode;
  sortFunc?: (a: any, b: any) => number;
  noSort?: boolean;
  wide?: boolean;
  narrow?: boolean;
  leftAlign?: boolean;
}

export type TUpdateGift = ({
  note,
  tokens,
}: {
  note?: string;
  tokens?: number;
}) => void;

export interface ITableSortOrder {
  field: number;
  ascending: 1 | -1;
}

export enum EConnectorNames {
  Injected = 'injected',
  WalletConnect = 'walletconnect',
  WalletLink = 'walletlink',
}

export interface IAuth {
  address?: string;
  connectorName?: EConnectorNames;
  authTokens: { [k: string]: string | undefined };
}

export interface IconProps extends React.SVGAttributes<SVGElement> {
  children?: never;
  color?: string;
}
