import React from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ThemeProvider } from '@material-ui/styles';

import {
  RecoilDebugger,
  GlobalUi,
  ErrorBoundary,
  MainLayout,
  SentryScopeController,
  WalletController,
} from 'components';
import { AppRoutes } from 'routes/routes';
import { createTheme } from 'theme';
import LuxonUTCUtils from 'utils/LuxonUTCUtils';

import { globalStyles } from './stitches.config';

import './App.css';

function getLibrary(provider: any): Web3Provider {
  const library =
    provider.isMetaMask || provider.isFrame
      ? new Web3Provider(provider)
      : provider;
  library.pollingInterval = 12000;
  return library;
}

const theme = createTheme();

const queryClient = new QueryClient();

function App() {
  globalStyles();
  return (
    <RecoilRoot>
      <SnackbarProvider maxSnack={3}>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <MuiPickersUtilsProvider utils={LuxonUTCUtils}>
                <Web3ReactProvider getLibrary={getLibrary}>
                  <BrowserRouter>
                    <WalletController />
                    <MainLayout>
                      <RecoilDebugger />
                      <GlobalUi />
                      <SentryScopeController />
                      <AppRoutes />
                    </MainLayout>
                  </BrowserRouter>
                </Web3ReactProvider>
              </MuiPickersUtilsProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </SnackbarProvider>
    </RecoilRoot>
  );
}

export default App;
