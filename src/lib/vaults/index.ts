import assert from 'assert';

import { utils } from 'ethers';
import { GraphQLTypes } from 'lib/gql/__generated__/zeus';

const PREFIX = 'circle';
const VERSION = '1';
const DELIMITER = '-';

export const encodeCircleId = (circleId: number) => {
  const label = `${PREFIX}${DELIMITER}${VERSION}${DELIMITER}${circleId}`;
  return utils.formatBytes32String(label);
};

export const decodeCircleId = (value: string) => {
  const label = utils.parseBytes32String(value);

  // version is not used yet
  const [prefix, , id] = label.split(DELIMITER);

  if (prefix !== PREFIX) {
    throw new Error('Could not decode circle ID');
  }

  return Number(id);
};

export enum Asset {
  DAI = 'DAI',
  USDC = 'USDC',
  USDT = 'USDT',
  YFI = 'YFI',
}

export const getTokenAddress = (
  vault: Pick<
    GraphQLTypes['vaults'],
    'symbol' | 'token_address' | 'simple_token_address'
  >
): string => {
  const address = Object.values(Asset).includes(vault.symbol as Asset)
    ? vault.token_address
    : vault.simple_token_address;
  assert(address, 'Vault is missing token address');
  return address;
};
