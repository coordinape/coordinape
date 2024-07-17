import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { initFrontend as initAnalytics } from 'features/analytics';
import { Helmet } from 'react-helmet';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { WagmiProvider, http } from 'wagmi';
import { mainnet, base, optimism, arbitrum, polygon } from 'wagmi/chains';

import { ThemeProvider as DeprecatedMuiThemeProvider } from '@material-ui/styles';

import { ErrorBoundary } from 'components';
import { ToastContainer } from 'components/ToastContainer';
import { WALLET_CONNECT_V2_PROJECT_ID } from 'config/env';
import { Web3ReactProvider } from 'hooks/useWeb3React';
import { createTheme } from 'theme';

import { useIsCoLinksSite } from './features/colinks/useIsCoLinksSite';
import ThemeProvider from './features/theming/ThemeProvider';
import { AppRoutes } from './routes/routes';
import { globalStyles } from './stitches.config';

import './App.css';
import '@rainbow-me/rainbowkit/styles.css';

const config = getDefaultConfig({
  appName: 'CoLinks | Coordinape',
  projectId: WALLET_CONNECT_V2_PROJECT_ID, //WalletConnect cloud project ID
  chains: [optimism, mainnet, base, arbitrum, polygon],
  transports: {
    [mainnet.id]: http(),
  },
});

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
          <WagmiProvider config={config}>
            <ToastContainer />
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider>
                <DeprecatedMuiThemeProvider theme={theme}>
                  <ThemeProvider>
                    <Web3ReactProvider>
                      <BrowserRouter>
                        <AppRoutes />
                      </BrowserRouter>
                    </Web3ReactProvider>
                  </ThemeProvider>
                </DeprecatedMuiThemeProvider>
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </ErrorBoundary>
      </RecoilRoot>
    </HelmetProvider>
  );
}

export default App;
