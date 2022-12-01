import { AddressZero } from '@ethersproject/constants';

import { provider } from 'utils/testing';

import { Contracts } from './contracts';

let contracts: Contracts;

beforeEach(async () => {
  contracts = await Contracts.fromProvider(provider());
});

test('getTokenAddress throws on unrecognized input', () => {
  expect(() => {
    contracts.getTokenAddress('FOO');
  }).toThrow();
});

test('getAvailableTokens does not throw on unrecognized input', () => {
  const tokens = contracts.getAvailableTokens(['NOPE', 'DAI']);
  expect(tokens).toEqual(['DAI']);
});

test('getPricePerShare', async () => {
  const { address } = await contracts.createVault('DAI', true);

  const price = await contracts.getPricePerShare(address, AddressZero, 18);
  expect(price.toUnsafeFloat()).toBeGreaterThan(1);
});

test('getPricePerShare with simple token', async () => {
  const tokenAddress = contracts.getToken('DAI').address;
  const { address } = await contracts.createVault('DAI');

  const price = await contracts.getPricePerShare(address, tokenAddress, 18);
  expect(price.toUnsafeFloat()).toEqual(1);
});
