import { render, screen, waitFor } from '@testing-library/react';

import { TestWrapper } from 'utils/testing';

import { useVaultFactory } from './useVaultFactory';

const getLibrary = (provider: any) => {
  console.log('getLibrary', provider); // eslint-disable-line
  return;
};

xtest('fails gracefully when contracts are not yet loaded', async () => {
  expect.assertions(1);

  let done = false;

  const Harness = () => {
    const { createApeVault } = useVaultFactory();

    createApeVault({ simpleTokenAddress: '0x0', type: 'USDC' }).then(result => {
      expect(result).toBeUndefined();
      console.log('result: ', result);
      done = true;
    });
    return <div>Hello world</div>;
  };

  render(
    <TestWrapper getLibrary={getLibrary}>
      <Harness />
    </TestWrapper>
  );

  screen.debug();

  await waitFor(() => done);
});
