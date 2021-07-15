import React from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { ThemeProvider } from '@material-ui/styles';

import {
  RecoilAppController,
  ErrorBoundary,
  MainLayout,
  SentryScopeController,
} from 'components';
import RenderRoutes from 'routes/routes';
import { createTheme } from 'theme';

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
            <Web3ReactProvider getLibrary={getLibrary}>
              <BrowserRouter>
                <MainLayout>
                  <RecoilAppController />
                  <SentryScopeController />
                  <RenderRoutes />
                </MainLayout>
              </BrowserRouter>
            </Web3ReactProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </SnackbarProvider>
    </RecoilRoot>
  );
}

export default App;
