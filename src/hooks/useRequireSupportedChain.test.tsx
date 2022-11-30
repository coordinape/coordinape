import { render, screen } from '@testing-library/react';

// @ts-ignore
import { mockChainId } from 'hooks/useWeb3React';
import { TestWrapper } from 'utils/testing';

import useRequireSupportedChain from './useRequireSupportedChain';

jest.mock('hooks/useWeb3React', () => {
  const originalModule = jest.requireActual('hooks/useWeb3React');
  const mockChainId = jest.fn();

  return {
    __esModule: true,
    ...originalModule,
    mockChainId,
    useWeb3React: () => {
      const orig = originalModule.useWeb3React();
      return {
        ...orig,
        chainId: mockChainId(),
      };
    },
  };
});

const Harness = () => {
  useRequireSupportedChain();
  return <></>;
};

test('on valid chain, does nothing', async () => {
  (mockChainId as jest.Mock).mockImplementation(() => 1);

  render(
    <TestWrapper>
      <Harness />
    </TestWrapper>
  );

  expect(screen.queryByText(/do not support chain/)).toBeNull();
});

test('on invalid chain, shows error', async () => {
  (mockChainId as jest.Mock).mockImplementation(() => 12345);

  render(
    <TestWrapper>
      <Harness />
    </TestWrapper>
  );

  screen.getByText(
    'Contract interactions do not support chain 12345. Please switch to Ethereum Mainnet.'
  );
});
