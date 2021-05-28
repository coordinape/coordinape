import React from 'react';

import { SnackbarProvider } from 'notistack';
import ReactDOM from 'react-dom';

import App from './App';
import AppLandingPage from './AppLandingPage';
import reportWebVitals from './reportWebVitals';
import './global';
import { DOMAIN_IS_APP } from './utils/domain';

if (DOMAIN_IS_APP) {
  ReactDOM.render(
    <React.StrictMode>
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider>
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
