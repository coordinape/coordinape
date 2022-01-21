import React from 'react';

import { CaptureConsole } from '@sentry/integrations';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import ReactDOM from 'react-dom';

import App from './App';
import AppLandingPage from './AppLandingPage';
import reportWebVitals from './reportWebVitals';
import './global';
import { DOMAIN_IS_PREVIEW, RENDER_APP } from './utils/domain';

Sentry.init({
  environment: DOMAIN_IS_PREVIEW ? 'development' : 'production',
  dsn: 'https://3070d0770b084a2ab4f5873a88ff4b1b@o1123412.ingest.sentry.io/6161273',
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
  tracesSampleRate: 1.0,
});
Sentry.setTag('landing_page', !RENDER_APP);

const myUndefinedFunction = () => {
  throw new Error('sentry test error just vercel');
};

if (RENDER_APP) {
  myUndefinedFunction();
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
} else {
  myUndefinedFunction();
  ReactDOM.render(
    <React.StrictMode>
      <AppLandingPage />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
