import { BigNumber } from "ethers";

export type Maybe<T> = T | null;

export type NetworkId = 1;
export type KnownToken = "fma" | "fss" | "flap";

export type KnownContract = "stake";

export interface INetwork {
  label: string;
  url: string;
  contracts: {
    [key in KnownContract]: string;
  };
}

export interface IKnownTokenData {
  symbol: string;
  decimals: number;
  image: string;
  addresses: {
    [K in NetworkId]?: string;
  };
}

export interface IToken {
  address: string;
  decimals: number;
  symbol: string;
  image: string;
}
