import { ZERO_ADDRESS } from 'config/constants';
import { chainId, provider } from 'utils/testing';

import { Contracts } from './contracts';

test('getPricePerShare', async () => {
  const contracts = new Contracts(chainId, provider);
  const tokenAddress = contracts.getToken('DAI').address;
  const tx = await contracts.vaultFactory.createApeVault(
    tokenAddress,
    ZERO_ADDRESS
  );
  const receipt = await tx.wait();
  const event = receipt.events?.find(e => e.event === 'VaultCreated');
  const vaultAddress = event?.args?.vault;

  const price = await contracts.getPricePerShare(vaultAddress, 'DAI', 18);
  expect(price.toUnsafeFloat()).toBeGreaterThan(1);
});
