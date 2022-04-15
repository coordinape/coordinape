import { act, render, waitFor } from '@testing-library/react';
import { BigNumber } from 'ethers';
import type { ERC20 } from 'lib/vaults';

import { TestWrapper } from 'utils/testing';

import { useContracts } from './useContracts';

test('return undefined when the web3 provider is not ready', async () => {
  expect.assertions(1);

  const Harness = () => {
    const contracts = useContracts();
    expect(contracts).toBeUndefined();
    return <></>;
  };

  await render(
    <TestWrapper>
      <Harness />
    </TestWrapper>
  );
});

test('set up contracts', async () => {
  let balance: BigNumber | undefined;

  const Harness = () => {
    const contracts = useContracts();
    if (contracts) {
      (async () => {
        balance = await contracts.getETHBalance();
      })();
    }
    return <></>;
  };

  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <Harness />
      </TestWrapper>
    );
  });

  // assuming the test user has been funded with 1000 ETH
  await waitFor(() =>
    expect(balance?.div(BigNumber.from(10).pow(18)).toNumber()).toBeGreaterThan(
      900
    )
  );
});

test('getToken', async () => {
  let dai: ERC20;

  const Harness = () => {
    const contracts = useContracts();
    if (contracts) dai = contracts.getToken('DAI');
    return <></>;
  };

  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <Harness />
      </TestWrapper>
    );
  });

  await waitFor(async () => {
    expect(dai).toBeDefined();
    expect(await dai.symbol()).toEqual('DAI');
  });
});
