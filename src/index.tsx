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
  dsn: 'https://1b672f036d56422ea7087e932011ec74@o919561.ingest.sentry.io/5863782',
  integrations: [
    new Integrations.BrowserTracing(),
    new CaptureConsole({
      levels: ['error'],
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
