import React from 'react';

import { globalStyles } from '../src/stitches.config';
export const decorators = [
  Story => {
    globalStyles();
    return <Story />;
  },
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
