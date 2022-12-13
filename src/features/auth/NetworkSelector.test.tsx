import { act, render, screen } from '@testing-library/react';

import { TestWrapper } from 'utils/testing';
import { TestProvider } from 'utils/testing/ethereum';
import { rpcUrl } from 'utils/testing/provider';

import { NetworkSelector } from './NetworkSelector';

test('without window.ethereum, button is disabled', async () => {
  await act(async () => {
    await render(
      <TestWrapper>
        <NetworkSelector />
      </TestWrapper>
    );
  });

  expect(
    screen.getByRole('button', { name: 'Ethereum Mainnet' })
  ).toBeDisabled();
});

const ethMock = new TestProvider(rpcUrl);
ethMock.mockChainId = '0xfa';
// (ethMock as any).request = jest.fn((...args) => console.log(args));

describe('with metamask enabled', () => {
  beforeAll(() => {
    (window as any).ethereum = ethMock;
  });

  afterAll(() => {
    delete (window as any).ethereum;
  });

  test('button is enabled', async () => {
    await act(async () => {
      await render(
        <TestWrapper withWeb3>
          <NetworkSelector />
        </TestWrapper>
      );
    });
    const button = screen.getByText('Fantom Opera');
    expect(button).not.toBeDisabled();
  });

  test('click on current network to see network options', async () => {
    await act(async () => {
      await render(
        <TestWrapper withWeb3>
          <NetworkSelector />
        </TestWrapper>
      );
    });

    screen.getByText('Fantom Opera').click();
    screen.getByText('Polygon').click();
    expect(ethMock.calls).toContain('wallet_switchEthereumChain');
  });
});
