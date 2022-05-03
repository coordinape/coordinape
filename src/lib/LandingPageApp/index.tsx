import React from 'react';

import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import createLandingPageTheme from './createLandingPageTheme';
import LandingPage from './LandingPage';

import '../../App.css';

const theme = createLandingPageTheme();

export default function LandingPageApp() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LandingPage />
    </ThemeProvider>
  );
}
