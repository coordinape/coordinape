import { render, screen } from '@testing-library/react';

import { ToastContainer } from 'components/ToastContainer';

import useRequireSupportedChain from './useRequireSupportedChain';
// @ts-ignore
import { Web3ReactProvider, mockChainId } from './useWeb3React';

jest.mock('./useWeb3React', () => {
  const originalModule = jest.requireActual('./useWeb3React');
  const mockChainId = jest.fn(() => 'mockme');

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

// ???: if i use the default TestWrapper, the call to useWeb3React in
// Web3Activator gets the correct mock implementations below, but the one we
// care about in useRequireSupportedChain doesn't
const TestWrapper = ({ children }: { children: any }) => (
  <Web3ReactProvider>
    <ToastContainer />
    {children}
  </Web3ReactProvider>
);

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

  await screen.findByText(
    'Contract interactions do not support chain 12345. Please switch to Ethereum Mainnet.'
  );
});
