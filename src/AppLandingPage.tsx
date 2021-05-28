import React from 'react';

import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import LandingPage from 'pages/LandingPage';
import createLandingPageTheme from 'theme/createLandingPageTheme';

import './App.css';

const theme = createLandingPageTheme();

function AppLandingPage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LandingPage />
    </ThemeProvider>
  );
}

export default AppLandingPage;
