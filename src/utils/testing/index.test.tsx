import { render, waitFor } from '@testing-library/react';

import useConnectedAddress from 'hooks/useConnectedAddress';

import { TestWrapper } from '.';

vi.mock('hooks/useConnectedAddress', () => ({
  default: () => '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
}));

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
