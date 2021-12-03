import React from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import { SnackbarProvider } from 'notistack';
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
import RenderRoutes from 'routes/routes';
import { createTheme } from 'theme';
import LuxonUTCUtils from 'utils/LuxonUTCUtils';

import './App.css';

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const theme = createTheme();

function App() {
  return (
    <RecoilRoot>
      <SnackbarProvider maxSnack={3}>
        <ErrorBoundary>
          <ThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={LuxonUTCUtils}>
              <Web3ReactProvider getLibrary={getLibrary}>
                <BrowserRouter>
                  <WalletController />
                  <MainLayout>
                    <RecoilDebugger />
                    <GlobalUi />
                    <SentryScopeController />
                    <RenderRoutes />
                  </MainLayout>
                </BrowserRouter>
              </Web3ReactProvider>
            </MuiPickersUtilsProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </SnackbarProvider>
    </RecoilRoot>
  );
}

export default App;
