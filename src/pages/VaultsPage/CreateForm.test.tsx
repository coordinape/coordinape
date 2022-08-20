import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import { TestWrapper } from 'utils/testing';

import { CreateForm } from './CreateForm';

test('select an asset', async () => {
  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <CreateForm onSuccess={() => {}} orgId={1} />
      </TestWrapper>
    );
  });
  await screen.findByText('DAI');
  fireEvent.click(screen.getByText('DAI'));
  const submitButton = screen.getByText('Create CoVault') as HTMLButtonElement;
  await waitFor(() => expect(submitButton.disabled).toBeFalsy());
});

test('input an invalid address for custom asset', async () => {
  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <CreateForm onSuccess={() => {}} orgId={1} />
      </TestWrapper>
    );
  });
  await screen.findByText('DAI');
  fireEvent.click(screen.getByText('Other ERC-20 Token'));
  await screen.findByText('Token contract address');
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: '0xf00' } });
  fireEvent.blur(input);
  await screen.findByText(/enter a valid ERC20/);
});

test('input a valid but non-ERC20 address for custom asset', async () => {
  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <CreateForm onSuccess={() => {}} orgId={1} />
      </TestWrapper>
    );
  });
  await screen.findByText('DAI');
  fireEvent.click(screen.getByText('Other ERC-20 Token'));
  await screen.findByText('Token contract address');
  const input = screen.getByRole('textbox');
  fireEvent.change(input, {
    target: { value: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45' },
  });
  fireEvent.blur(input);
  await screen.findByText(/enter a valid ERC20/);
});
