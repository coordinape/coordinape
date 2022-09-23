import React from 'react';

import ReactDOM from 'react-dom';

import { initSentry } from 'utils/reporting';

import App from './App';

initSentry();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
