import { render } from '@testing-library/react';

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
