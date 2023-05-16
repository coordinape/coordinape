import LuxonUtils from '@date-io/luxon';
import mp from 'mixpanel-browser';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ThemeProvider as DeprecatedMuiThemeProvider } from '@material-ui/styles';

import { ErrorBoundary } from 'components';
import { ToastContainer } from 'components/ToastContainer';
import { Web3ReactProvider } from 'hooks/useWeb3React';
import { AppRoutes } from 'routes/routes';
import { createTheme } from 'theme';

import ThemeProvider from './features/theming/ThemeProvider';
import { globalStyles } from './stitches.config';

import './App.css';

const theme = createTheme();
const queryClient = new QueryClient();

if (process.env.REACT_APP_MIXPANEL_TOKEN) {
  mp.init(process.env.REACT_APP_MIXPANEL_TOKEN, {
    api_host: process.env.REACT_APP_MIXPANEL_HOST,
    debug: true,
    ignore_dnt: true, // just for dev
  });

  if (typeof window !== 'undefined') {
    (window as any).testMp = () => {
      mp.track('test', { foo: 'bar ' });
    };
  }
}

function App() {
  globalStyles();
  return (
    <RecoilRoot>
      <ErrorBoundary>
        <ToastContainer />
        <QueryClientProvider client={queryClient}>
          <DeprecatedMuiThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={LuxonUtils}>
              <ThemeProvider>
                <Web3ReactProvider>
                  <BrowserRouter>
                    <AppRoutes />
                  </BrowserRouter>
                </Web3ReactProvider>
              </ThemeProvider>
            </MuiPickersUtilsProvider>
          </DeprecatedMuiThemeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </RecoilRoot>
  );
}

export default App;
