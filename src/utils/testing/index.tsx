/* eslint-disable @typescript-eslint/no-unused-vars */
import assert from 'assert';
import { ReactNode, Suspense } from 'react';

import {
  QueryClient as QC,
  QueryClientProvider as QCP,
} from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { WagmiProvider } from 'wagmi';

import { ThemeProvider as DeprecatedMaterialUIThemeProvider } from '@material-ui/styles';

import ThemeProvider from '../../features/theming/ThemeProvider';
import { wagmiConfig } from '../../features/wagmi/config';
import { AppRoutes } from '../../routes/routes';
import { ToastContainer } from 'components/ToastContainer';
import { createTheme } from 'theme';

const theme = createTheme();

type TestWrapperProps = {
  children?: ReactNode;
  withRoutes?: boolean;
  withWeb3?: boolean;
  queryClientCallback?: (queryClient: QueryClient) => void;
  routeHistory?: string[];
};

export const TestWrapper = ({
  children = null,
  withWeb3 = false,
  withRoutes = false,
  queryClientCallback,
  routeHistory = ['/'],
}: TestWrapperProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // for the newer version of react-query used by Wagmi/Rainbow
  const qc = new QC({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  queryClientCallback?.(queryClient);

  assert(
    withRoutes || children,
    'TestWrapper must have withRoutes or children'
  );

  return (
    <RecoilRoot>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <QCP client={qc}>
              <MemoryRouter initialEntries={routeHistory}>
                <ThemeProvider>
                  <DeprecatedMaterialUIThemeProvider theme={theme}>
                    <Suspense fallback="Suspended...">
                      {withRoutes ? <AppRoutes /> : children}
                    </Suspense>
                  </DeprecatedMaterialUIThemeProvider>
                </ThemeProvider>
              </MemoryRouter>
            </QCP>
          </QueryClientProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export * from './recoil';
