import _ from 'lodash';

import { colors, createMuiTheme, responsiveFontSizes } from '@material-ui/core';

import customColor from './colors';
import custom from './custom';
import { strongShadows } from './shadows';
import typography from './typography';

const baseOptions = {
  typography,
  overrides: {
    MuiLinearProgress: {
      root: {
        width: '100%',
        borderRadius: 3,
        overflow: 'hidden',
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 32,
      },
    },
    MuiChip: {
      root: {
        backgroundColor: 'rgba(0,0,0,0.075)',
      },
    },
  },
};

const themeOptions = {
  overrides: {
    MuiInputBase: {
      input: {
        '&::placeholder': {
          opacity: 1,
          color: colors.blueGrey[600],
        },
      },
    },
    MuiButton: {
      root: {
        padding: '14px 20px',
        borderRadius: '6px',
      },
    },
    MuiStepIcon: {
      root: {
        '&.MuiStepIcon-active': {
          color: customColor.red,
          '& .MuiStepIcon-text': {
            fill: customColor.white,
          },
        },
        '&.MuiStepIcon-completed': {
          color: '#51AF5B',
          '& .MuiStepIcon-text': {
            fill: customColor.white,
          },
        },
      },
      text: {
        fill: '#93A1A1',
      },
    },
    MuiStepLabel: {
      label: {
        color: customColor.black,
      },
    },
    MuiSkeleton: {
      root: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      },
    },
    MuiPaginationItem: {
      outlined: {
        backgroundColor: customColor.white,
        border: '1px solid #EDFDFE',
        '&.Mui-selected': {
          backgroundColor: customColor.red,
          color: customColor.white,
        },
        '&:hover': {
          backgroundColor: customColor.red,
          color: customColor.white,
        },
        '&.Mui-selected:hover': {
          backgroundColor: customColor.red,
          color: customColor.white,
        },
      },
    },
    MuiDivider: {
      root: {
        alignSelf: 'stretch',
        backgroundColor: 'rgba(0,0,0,0.2)',
        margin: '3px 0',
      },
    },
  },
  palette: {
    type: 'dark',
    action: {
      active: 'rgba(255, 255, 255, 0.54)',
      hover: 'rgba(255, 255, 255, 0.04)',
      selected: 'rgba(255, 255, 255, 0.4)',
      disabled: 'rgba(255, 255, 255, 0.26)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
      focus: 'rgba(255, 255, 255, 0.12)',
    },
    background: {
      default: '#030616',
      dark: '#1c2025',
      paper: customColor.third,
    },
    primary: {
      main: '#c43737',
    },
    secondary: {
      main: '#c43737',
    },
    text: {
      primary: '#555555',
      secondary: '#adb0bb',
    },
  },
  shadows: strongShadows,
};

export const createTheme = () => {
  let theme = createMuiTheme(
    _.merge(
      {},
      baseOptions,
      themeOptions,
      { custom },
      { colors: customColor }
    ) as any
  );

  theme = responsiveFontSizes(theme);

  return theme;
};
