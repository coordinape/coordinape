import React from 'react';

import ReactDOM from 'react-dom';

import { initSentry } from 'utils/reporting';

import App from './App';
import AppLandingPage from './AppLandingPage';
import { RENDER_APP } from './utils/domain';

initSentry();

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
