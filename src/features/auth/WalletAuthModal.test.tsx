import { act, render, screen } from '@testing-library/react';

import { TestWrapper } from 'utils/testing';
import { TestProvider } from 'utils/testing/ethereum';
import { rpcUrl } from 'utils/testing/provider';

import { WalletAuthModal } from './WalletAuthModal';

const ethMock = new TestProvider(rpcUrl);
describe('with metamask enabled', () => {
  beforeAll(() => {
    (window as any).ethereum = ethMock;
  });

  afterAll(() => {
    delete (window as any).ethereum;
  });

  test('the metamask login button is enabled', async () => {
    await act(async () => {
      await render(
        <TestWrapper withWeb3>
          <WalletAuthModal />
        </TestWrapper>
      );
    });
    screen.getByText('Metamask');
  });
});

test('without metamask, the metamask login option is disabled', async () => {
  await act(async () => {
    await render(
      <TestWrapper>
        <WalletAuthModal />
      </TestWrapper>
    );
  });

  const button = screen.getByText('Metamask Not Found');
  expect(button).toBeDisabled;
});
