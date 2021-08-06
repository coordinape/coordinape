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
    MuiIconButton: {
      root: {
        color: '#aab2b5',
      },
    },
    MuiButton: {
      root: {
        textTransform: 'none',
        fontSize: 19,
        lineHeight: 1.26,
        padding: '12px 24px',
        borderRadius: '13px',
      },
      text: {
        color: '#84C7CA',
        '&:hover': {
          color: '#4e7577',
          backgroundColor: 'transparent',
        },
      },
      sizeSmall: {
        fontSize: 13,
        lineHeight: 1.28,
        padding: '8px 24px',
        borderRadius: '8px',
        // This must be a bug that it gets overwritten here
        '&.MuiButton-textSizeSmall': {
          fontSize: 14,
          lineHeight: 1.3,
          fontWeight: 400,
          padding: 0,
        },
      },
      contained: {
        color: 'white',
        backgroundColor: '#A8B1B4',
        boxShadow: '0px 6.5px 9.75px #E6EAEC',
        '&:hover': {
          backgroundColor: '#A8B1B4',
          background:
            'linear-gradient(0deg, rgba(81, 99, 105, 0.3), rgba(81, 99, 105, 0.3)), #A8B1B4',
          boxShadow: '0px 6.5px 9.75px #DCE2E4',
        },
        '&:active': {
          boxShadow: '0px 6.5px 9.75px #cbd0d2',
        },
        '&.Mui-disabled': {
          color: 'white',
          backgroundColor: '#A8B1B480',
          boxShadow: 'box-shadow: 0px 6.5px 9.75px #E6EAEC',
        },
      },
      containedPrimary: {
        backgroundColor: '#EF7376',
        '&:hover': {
          backgroundColor: '#EF7376',
          background:
            'linear-gradient(0deg, rgba(81, 99, 105, 0.1), rgba(81, 99, 105, 0.1)), #EF7376',
          boxShadow: '0px 6.5px 9.75px #DCE2E4',
        },
        '&.Mui-disabled': {
          color: 'white',
          backgroundColor: '#EF737680',
          boxShadow: 'box-shadow: 0px 6.5px 9.75px #E6EAEC',
        },
      },
      containedSecondary: {
        backgroundColor: '#41595e',
        '&:hover': {
          backgroundColor: '#41595e',
          background:
            'linear-gradient(0deg, rgba(17, 24, 25, 0.4), rgba(17, 24, 25, 0.4)), #41595e',
          boxShadow: '0px 6.5px 9.75px #DCE2E4',
        },
        '&.Mui-disabled': {
          color: 'white',
          backgroundColor: '#41595e80',
          boxShadow: 'box-shadow: 0px 6.5px 9.75px #E6EAEC',
        },
      },
    },
    MuiStepIcon: {
      root: {
        '&.MuiStepIcon-active': {
          color: customColor.red,
          '& .MuiStepIcon-text': {
            fill: 'white',
          },
        },
        '&.MuiStepIcon-completed': {
          color: '#51AF5B',
          '& .MuiStepIcon-text': {
            fill: 'white',
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
    MuiStepButton: {
      root: {
        '&.Mui-disabled': {
          opacity: 0.4,
        },
      },
    },
    MuiSkeleton: {
      root: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      },
    },
    MuiPaginationItem: {
      outlined: {
        backgroundColor: 'white',
        border: '1px solid #EDFDFE',
        '&.Mui-selected': {
          backgroundColor: customColor.red,
          color: 'white',
        },
        '&:hover': {
          backgroundColor: customColor.red,
          color: 'white',
        },
        '&.Mui-selected:hover': {
          backgroundColor: customColor.red,
          color: 'white',
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
    type: 'light',
    action: {
      active: 'rgba(255, 255, 255, 0.54)',
      hover: 'rgba(255, 255, 255, 0.04)',
      selected: 'rgba(255, 255, 255, 0.4)',
      disabled: 'rgba(255, 255, 255, 0.26)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
      focus: 'rgba(255, 255, 255, 0.12)',
    },
    background: {
      default: customColor.background,
      dark: customColor.third,
      paper: customColor.lightBackground,
    },
    primary: {
      main: customColor.red,
      dark: '#cf7073',
      contrastText: '#fff',
    },
    secondary: {
      main: '#9da7ab',
      dark: '#818f94',
      contrastText: '#fff',
    },
    text: {
      primary: '#555555',
      secondary: '#adb0bb',
    },
    error: {
      main: '#EF7376',
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
