import assert from 'assert';
import { ReactNode, Suspense, useEffect } from 'react';

import { NetworkConnector } from '@web3-react/network-connector';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { ThemeProvider as DeprecatedMaterialUIThemeProvider } from '@material-ui/styles';

import ThemeProvider from '../../features/theming/ThemeProvider';
import { ToastContainer } from 'components/ToastContainer';
import { Web3ReactProvider, useWeb3React } from 'hooks/useWeb3React';
import { AppRoutes } from 'routes/routes';
import { createTheme } from 'theme';

import {
  chainId,
  rpcUrl,
  provider,
  takeSnapshot,
  restoreSnapshot,
} from './provider';
export { provider, takeSnapshot, restoreSnapshot };

const theme = createTheme();

type TestWrapperProps = {
  children?: ReactNode;
  getLibrary?: (provider: any) => any; // FIXME
  withRoutes?: boolean;
  withWeb3?: boolean;
  queryClientCallback?: (queryClient: QueryClient) => void;
  routeHistory?: string[];
};

const connector = new NetworkConnector({
  urls: { [chainId]: rpcUrl },
});

type Web3ActivatorProps = { children: ReactNode; enabled: boolean };
const Web3Activator = ({ children, enabled }: Web3ActivatorProps) => {
  const web3 = useWeb3React();
  useEffect(() => {
    if (enabled) web3.activate(connector);
  }, []);
  return <>{children}</>;
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

  queryClientCallback?.(queryClient);

  assert(
    withRoutes || children,
    'TestWrapper must have withRoutes or children'
  );

  return (
    <RecoilRoot>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <Web3ReactProvider>
          <Web3Activator enabled={withWeb3}>
            <MemoryRouter initialEntries={routeHistory}>
              <ThemeProvider>
                <DeprecatedMaterialUIThemeProvider theme={theme}>
                  <Suspense fallback="Suspended...">
                    {withRoutes ? <AppRoutes /> : children}
                  </Suspense>
                </DeprecatedMaterialUIThemeProvider>
              </ThemeProvider>
            </MemoryRouter>
          </Web3Activator>
        </Web3ReactProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export * from './recoil';
