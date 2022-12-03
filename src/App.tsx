import React from 'react';

import LuxonUtils from '@date-io/luxon';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { makeStyles } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ThemeProvider } from '@material-ui/styles';

import { ErrorBoundary, MainLayout } from 'components';
import { Web3ReactProvider } from 'hooks/useWeb3React';
import { createTheme } from 'theme';

import { snackbarStyles, globalStyles } from './stitches.config';

import './App.css';

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
              <MuiPickersUtilsProvider utils={LuxonUtils}>
                <Web3ReactProvider>
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
