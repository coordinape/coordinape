import deploymentInfo from '@coordinape/hardhat/dist/deploymentInfo.json';
import { act, render } from '@testing-library/react';

import { HARDHAT_CHAIN_ID } from 'config/env';
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
  expect.assertions(1);

  const Harness = () => {
    const contracts = useContracts();
    if (contracts) {
      expect(contracts.chainId).toEqual(HARDHAT_CHAIN_ID);
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

test('getToken', async () => {
  expect.assertions(2);

  const Harness = () => {
    const contracts = useContracts();
    if (contracts) {
      const dai = contracts.getToken('DAI');
      expect(dai).toBeDefined();
      expect(dai.address).toEqual(
        (deploymentInfo as any)[HARDHAT_CHAIN_ID].DAI.address
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
