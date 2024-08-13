import { initFrontend as initAnalytics } from 'features/analytics';
import { Helmet } from 'react-helmet';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { ThemeProvider as DeprecatedMuiThemeProvider } from '@material-ui/styles';

import { ErrorBoundary } from 'components';
import { ToastContainer } from 'components/ToastContainer';
import { createTheme } from 'theme';

import { useIsCoLinksSite } from './features/colinks/useIsCoLinksSite';
import { DebugOverlay } from './features/debug/DebugOverlay';
import { Rainbowify } from './features/rainbowkit/Rainbowify';
import ThemeProvider from './features/theming/ThemeProvider';
import { AppRoutes } from './routes/routes';
import { globalStyles } from './stitches.config';

import './App.css';

const theme = createTheme();
const queryClient = new QueryClient();
initAnalytics();

function App() {
  globalStyles();
  const isCoLinks = useIsCoLinksSite();

  // TODO: add this when we have a good favicon
  // useEffect(() => {
  //   if (isCoLinks) {
  //     let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
  //     if (!link) {
  //       link = document.createElement('link');
  //       link.rel = 'icon';
  //       document.getElementsByTagName('head')[0].appendChild(link);
  //     }
  //     link.href = webAppURL('colinks') + '/imgs/logo/colinks-favicon.png';
  //   }
  // }, []);

  return (
    <HelmetProvider>
      {isCoLinks ? (
        <Helmet>
          <title>CoLinks</title>
          <script
            defer
            data-api="/stats/api/event"
            data-domain="colinks.coordinape.com"
            src="/stats/js/script.js"
          ></script>
        </Helmet>
      ) : (
        <Helmet>
          <script
            defer
            data-api="/stats/api/event"
            data-domain="coordinape.com"
            src="/stats/js/script.js"
          ></script>
        </Helmet>
      )}
      <RecoilRoot>
        <ErrorBoundary>
          <ToastContainer />
          <QueryClientProvider client={queryClient}>
            <Rainbowify>
              <DeprecatedMuiThemeProvider theme={theme}>
                <ThemeProvider>
                  <BrowserRouter>
                    <AppRoutes />
                  </BrowserRouter>
                  <DebugOverlay />
                </ThemeProvider>
              </DeprecatedMuiThemeProvider>
            </Rainbowify>
          </QueryClientProvider>
        </ErrorBoundary>
      </RecoilRoot>
    </HelmetProvider>
  );
}

export default App;
