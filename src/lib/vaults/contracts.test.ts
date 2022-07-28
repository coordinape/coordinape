import { ZERO_ADDRESS } from 'config/constants';
import { chainId, provider } from 'utils/testing/provider';

import { Contracts } from './contracts';

test('getPricePerShare', async () => {
  const contracts = new Contracts(chainId, provider);
  const tokenAddress = contracts.getToken('DAI').address;
  const tx = await contracts.vaultFactory.createCoVault(
    tokenAddress,
    ZERO_ADDRESS
  );
  const receipt = await tx.wait();
  const event = receipt.events?.find(e => e.event === 'VaultCreated');
  const vaultAddress = event?.args?.vault;

  const price = await contracts.getPricePerShare(
    vaultAddress,
    ZERO_ADDRESS,
    18
  );
  expect(price.toUnsafeFloat()).toBeGreaterThan(1);
});

test('getPricePerShare with simple token', async () => {
  const contracts = new Contracts(chainId, provider);
  const tokenAddress = contracts.getToken('DAI').address;
  const tx = await contracts.vaultFactory.createCoVault(
    ZERO_ADDRESS,
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
