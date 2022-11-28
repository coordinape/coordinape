import { act, render, screen } from '@testing-library/react';

import { WalletAuthModal } from 'components/WalletAuthModal';
import { TestWrapper } from 'utils/testing';

const ethSpy = jest.fn(() => '0xfa');
describe('with metamask enabled', () => {
  beforeAll(() => {
    (window as any).ethereum = ethSpy;
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
