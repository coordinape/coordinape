import React from 'react';

import { CaptureConsole } from '@sentry/integrations';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import ReactDOM from 'react-dom';

import App from './App';
import AppLandingPage from './AppLandingPage';
import { DOMAIN_IS_PREVIEW, RENDER_APP } from './utils/domain';

Sentry.init({
  environment: DOMAIN_IS_PREVIEW ? 'development' : 'production',
  dsn: 'https://1b672f036d56422ea7087e932011ec74@o919561.ingest.sentry.io/5863782',
  // ignoreErrors accepts regex. Strings will match partially.
  ignoreErrors: [
    'MetaMask: Received invalid isUnlocked parameter.',
    'Supported chain ids are: 1.',
    'The user rejected the request.',
    'pktAnnotationHighlighter', // https://github.com/LessWrong2/Lesswrong2/issues/1150
  ],
  integrations: [
    new Integrations.BrowserTracing(),
    new CaptureConsole({
      levels: ['error'],
    }),
  ],
  tracesSampleRate: 0.1,
});
Sentry.setTag('landing_page', !RENDER_APP);

if (RENDER_APP) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
} else {
  ReactDOM.render(
    <React.StrictMode>
      <AppLandingPage />
    </React.StrictMode>,
    document.getElementById('root')
  );
}
