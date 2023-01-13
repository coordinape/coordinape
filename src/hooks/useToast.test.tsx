import { useEffect } from 'react';

import { render, screen, act, waitFor } from '@testing-library/react';

import { TestWrapper } from 'utils/testing';

import { useToast } from './useToast';

test('showDefault shows a default themed toast', async () => {
  const { showDefault } = useToast();
  const Harness = () => {
    useEffect(() => {
      showDefault('default toast');
    }, []);
    return <></>;
  };

  await act(async () => {
    render(
      <TestWrapper>
        <Harness />
      </TestWrapper>
    );
  });

  await waitFor(async () => {
    expect(screen.getByText('default toast')).toBeInTheDocument();
  });
});

test('showSuccess shows a default themed toast', async () => {
  const { showSuccess } = useToast();
  const Harness = () => {
    useEffect(() => {
      showSuccess('success toast');
    }, []);
    return <></>;
  };

  await act(async () => {
    render(
      <TestWrapper>
        <Harness />
      </TestWrapper>
    );
  });

  await waitFor(async () => {
    expect(screen.getByText('success toast')).toBeInTheDocument();
  });
});

test('showError shows a error themed toast', async () => {
  const { showError } = useToast();
  const Harness = () => {
    useEffect(() => {
      showError('error toast');
    }, []);
    return <></>;
  };

  await act(async () => {
    render(
      <TestWrapper>
        <Harness />
      </TestWrapper>
    );
  });

  await waitFor(async () => {
    expect(screen.getByText('error toast')).toBeInTheDocument();
  });
});
