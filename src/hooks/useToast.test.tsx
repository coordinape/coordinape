import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from '@testing-library/react';

import { Button } from 'ui';
import { TestWrapper } from 'utils/testing';

import { useToast } from './useToast';

test('showDefault shows a default themed toast', async () => {
  const { showDefault } = useToast();
  const Harness = () => {
    return (
      <Button onClick={() => showDefault('default toast')}>Click Here</Button>
    );
  };

  await act(async () => {
    render(
      <TestWrapper>
        <Harness />
      </TestWrapper>
    );
  });

  fireEvent.click(screen.getByText('Click Here'));

  await waitFor(async () => {
    expect(screen.getByText('default toast')).toBeInTheDocument();
  });
});

test('showError shows an error themed toast', async () => {
  const { showError } = useToast();
  const Harness = () => {
    return <Button onClick={() => showError('error toast')}>Click Here</Button>;
  };

  await act(async () => {
    render(
      <TestWrapper>
        <Harness />
      </TestWrapper>
    );
  });

  fireEvent.click(screen.getByText('Click Here'));

  await waitFor(async () => {
    expect(screen.getByText('error toast')).toBeInTheDocument();
  });
});

test('showSuccess shows a success themed toast', async () => {
  const { showSuccess } = useToast();
  const Harness = () => {
    return (
      <Button onClick={() => showSuccess('success toast')}>Click Here</Button>
    );
  };

  await act(async () => {
    render(
      <TestWrapper>
        <Harness />
      </TestWrapper>
    );
  });

  fireEvent.click(screen.getByText('Click Here'));

  await waitFor(async () => {
    expect(screen.getByText('success toast')).toBeInTheDocument();
  });
});
