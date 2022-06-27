import React from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { makeStyles } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ThemeProvider } from '@material-ui/styles';

import { ErrorBoundary, MainLayout } from 'components';
import { createTheme } from 'theme';
import LuxonUTCUtils from 'utils/LuxonUTCUtils';

import { snackbarStyles, globalStyles } from './stitches.config';

import './App.css';

function getLibrary(provider: any): Web3Provider {
  // This checks specifically whether the provider is
  // an instance of a Web3Provider by checking the existence of this
  // uniquely named method. Normally, we would want to use `instanceof`
  // to check if a provider conforms to a specific class, but because
  // some providers are injected into the window from other contexts,
  // this check will fail, since those providers aren't derived from
  // the same prototype tree.
  const library =
    typeof provider.jsonRpcFetchFunc !== 'undefined'
      ? provider
      : new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const theme = createTheme();

const queryClient = new QueryClient();

const useStyles = makeStyles(() => snackbarStyles);

function App() {
  globalStyles();
  const snackbarClasses = useStyles();
  return (
    <RecoilRoot>
      <SnackbarProvider maxSnack={3} classes={snackbarClasses}>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <MuiPickersUtilsProvider utils={LuxonUTCUtils}>
                <Web3ReactProvider getLibrary={getLibrary}>
                  <BrowserRouter>
                    <MainLayout />
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
