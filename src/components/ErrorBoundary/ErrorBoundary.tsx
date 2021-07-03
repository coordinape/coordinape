import React, { Component, ErrorInfo, ReactNode } from 'react';

import {
  useSnackbar,
  SnackbarMessage,
  OptionsObject,
  SnackbarKey,
} from 'notistack';

interface IInnerProps {
  children: ReactNode;
  enqueueSnackbar: (
    message: SnackbarMessage,
    options?: OptionsObject
  ) => SnackbarKey;
}

interface State {
  hasError: boolean;
}

class InnerErrorBoundary extends Component<IInnerProps, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error('Caught in Error boundary:', error, errorInfo);
    this.props.enqueueSnackbar(
      error?.response?.data?.message ||
        error?.message ||
        'Something went wrong!',
      { variant: 'error' }
    );
  }

  public render() {
    return this.props.children;
  }
}

export const ErrorBoundary = ({ children }: { children: ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar();
  return (
    <InnerErrorBoundary enqueueSnackbar={enqueueSnackbar}>
      {children}
    </InnerErrorBoundary>
  );
};
