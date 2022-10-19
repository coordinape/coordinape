import { AddressZero } from '@ethersproject/constants';

import { chainId, provider } from 'utils/testing/provider';

import { Contracts } from './contracts';

let contracts: Contracts;

beforeEach(() => {
  contracts = new Contracts(chainId, provider);
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
  const tokenAddress = contracts.getToken('DAI').address;
  const tx = await contracts.vaultFactory.createCoVault(
    tokenAddress,
    AddressZero
  );
  const receipt = await tx.wait();
  const event = receipt.events?.find(e => e.event === 'VaultCreated');
  const vaultAddress = event?.args?.vault;

  const price = await contracts.getPricePerShare(vaultAddress, AddressZero, 18);
  expect(price.toUnsafeFloat()).toBeGreaterThan(1);
});

test('getPricePerShare with simple token', async () => {
  const tokenAddress = contracts.getToken('DAI').address;
  const tx = await contracts.vaultFactory.createCoVault(
    AddressZero,
    tokenAddress
  );
  const receipt = await tx.wait();
  const event = receipt.events?.find(e => e.event === 'VaultCreated');
  const vaultAddress = event?.args?.vault;

  const price = await contracts.getPricePerShare(
    vaultAddress,
    tokenAddress,
    18
  );
  expect(price.toUnsafeFloat()).toEqual(1);
});
