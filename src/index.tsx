import React from 'react';

import LandingPageApp from 'lib/LandingPageApp';
import ReactDOM from 'react-dom';

import { initSentry } from 'utils/reporting';

import App from './App';
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
      <LandingPageApp />
    </React.StrictMode>,
    document.getElementById('root')
  );
}
