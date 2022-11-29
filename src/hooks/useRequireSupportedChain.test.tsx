import { render, screen } from '@testing-library/react';
// @ts-ignore
import { mockChainId } from '@web3-react/core';

import { TestWrapper } from 'utils/testing';

import useRequireSupportedChain from './useRequireSupportedChain';

jest.mock('@web3-react/core', () => {
  const originalModule = jest.requireActual('@web3-react/core');
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
