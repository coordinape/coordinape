import { render, waitFor } from '@testing-library/react';

import useConnectedAddress from 'hooks/useConnectedAddress';

import { TestWrapper } from '.';

test('activate connector', async () => {
  let actual: string;

  const Harness = () => {
    const address = useConnectedAddress();
    if (address) actual = address;
    return null;
  };

  await render(
    <TestWrapper withWeb3>
      <Harness />
    </TestWrapper>
  );

  await waitFor(() => expect(actual).toMatch(/[a-zA-Z0-9]{40}/));
});
