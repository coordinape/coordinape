import { hexZeroPad } from '@ethersproject/bytes';
import { AddressZero } from '@ethersproject/constants';
import { parseUnits } from '@ethersproject/units';

import { mint, tokens } from 'utils/testing/mint';
import { chainId, provider } from 'utils/testing/provider';

import { Contracts, encodeCircleId, getWrappedAmount } from '.';
import { uploadEpochRoot } from './distributor';

const contracts = new Contracts(chainId, provider);

describe('simple token', () => {
  beforeEach(async () => {
    await mint({ token: 'SHIB', amount: '1000' });
  });

  test('upload epoch root', async () => {
    const tokenAddress = tokens.SHIB.addr;
    const createVaultTx = await contracts.vaultFactory.createCoVault(
      AddressZero,
      tokenAddress
    );
    const receipt1 = await createVaultTx.wait();
    const vaultAddress = receipt1.events?.find(e => e.event === 'VaultCreated')
      ?.args?.vault;

    const vault = {
      vault_address: vaultAddress,
      simple_token_address: tokenAddress,
    };

    const amount = parseUnits('1000', 18);
    const token = contracts.getERC20(tokenAddress);
    await token.transfer(vaultAddress, amount);
    const root = hexZeroPad('0xa', 32);

    const distributeTx = await uploadEpochRoot(
      contracts,
      vault as typeof uploadEpochRoot.arguments.vault,
      1,
      root,
      amount
    );

    const receipt2 = await distributeTx.wait();
    const log = receipt2.events?.find(e => e.event === 'EpochFunded');

    const storedRoot = await contracts.distributor.epochRoots(
      vaultAddress,
      encodeCircleId(1),
      tokenAddress,
      log?.args?.epochId
    );
    expect(storedRoot).toEqual(root);
  });
});

describe('yearn token', () => {
  beforeEach(async () => {
    await mint({ token: 'DAI', amount: '1000' });
  });

  test('upload epoch root', async () => {
    const tokenAddress = tokens.DAI.addr;
    const createVaultTx = await contracts.vaultFactory.createCoVault(
      tokenAddress,
      AddressZero
    );
    const receipt1 = await createVaultTx.wait();
    const vaultAddress = receipt1.events?.find(e => e.event === 'VaultCreated')
      ?.args?.vault;

    const token = contracts.getERC20(tokenAddress);
    const vault = {
      vault_address: vaultAddress,
      token_address: tokenAddress,
      simple_token_address: AddressZero,
      decimals: await token.decimals(),
    };

    const amount = parseUnits('1000', vault.decimals);
    await token.approve(contracts.router.address, amount);
    await contracts.router.delegateDeposit(vaultAddress, tokenAddress, amount);
    const root = hexZeroPad('0xb', 32);

    const distributeTx = await uploadEpochRoot(
      contracts,
      vault as typeof uploadEpochRoot.arguments.vault,
      1,
      root,
      await getWrappedAmount('1000', vault, contracts)
    );

    const receipt2 = await distributeTx.wait();
    const log = receipt2.events?.find(e => e.event === 'EpochFunded');

    const storedRoot = await contracts.distributor.epochRoots(
      vaultAddress,
      encodeCircleId(1),
      await contracts.getVault(vaultAddress).vault(),
      log?.args?.epochId
    );
    expect(storedRoot).toEqual(root);
  });
});
