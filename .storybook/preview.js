import React from 'react';

import { globalStyles } from '../src/stitches.config';
import { newColors as colors } from '../src/ui/new-colors';

export const decorators = [
  Story => {
    globalStyles();
    return <Story />;
  },
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    expanded: true,
    presetColors: colors,
    hideNoControlsWarning: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const argTypes = {
  as: {
    table: {
      disable: true,
    },
  },
  asChild: {
    table: {
      disable: true,
    },
  },
  css: {
    table: {
      disable: true,
    },
  },
  ref: {
    table: {
      disable: true,
    },
  },
};
