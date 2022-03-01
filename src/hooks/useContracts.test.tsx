import deploymentInfo from '@coordinape/hardhat/dist/deploymentInfo.json';
import { act, render, waitFor } from '@testing-library/react';
import { BigNumber } from 'ethers';

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
  expect.assertions(2);

  const Harness = () => {
    const contracts = useContracts();
    if (contracts) {
      const dai = contracts.getToken('DAI');
      expect(dai).toBeDefined();
      expect(dai.address).toEqual(
        (deploymentInfo as any)[contracts.chainId].DAI.address
      );
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
});
