import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import 'hooks/gql';
import { TestWrapper } from 'utils/testing';
import { CreateForm } from './CreateForm';

jest.mock('hooks/gql', () => {
  return {
    useCurrentOrg: jest.fn(() => ({ id: 101, name: 'Mock Org' })),
  };
});

test('select an asset', async () => {
  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <CreateForm onSuccess={() => {}} />
      </TestWrapper>
    );
  });
  await screen.findByText('DAI');
  fireEvent.click(screen.getByText('DAI'));
  const submitButton = screen.getByText('Create Vault') as HTMLButtonElement;
  await waitFor(() => expect(submitButton.disabled).toBeFalsy());
});

test('input an invalid address for custom asset', async () => {
  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <CreateForm onSuccess={() => {}} />
      </TestWrapper>
    );
  });
  await screen.findByText('DAI');
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: '0xf00' } });
  fireEvent.blur(input);
  await screen.findByText(/enter a valid ERC20/);
});

test('input a valid but non-ERC20 address for custom asset', async () => {
  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <CreateForm onSuccess={() => {}} />
      </TestWrapper>
    );
  });
  await screen.findByText('DAI');
  const input = screen.getByRole('textbox');
  fireEvent.change(input, {
    target: { value: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45' },
  });
  fireEvent.blur(input);
  await screen.findByText(/enter a valid ERC20/);
});
