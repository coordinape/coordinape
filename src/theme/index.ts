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
        textDecoration: 'underline',
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
        boxShadow: '0px 6.5px 9.75px rgba(181, 193, 199, 0.3)',
      },
      containedPrimary: {
        '&:hover': {
          background:
            'linear-gradient(0deg, rgba(81, 99, 105, 0.2), rgba(81, 99, 105, 0.2)), #EF7376',
          boxShadow: '0px 6.5px 9.75px rgba(184, 196, 201, 0.5)',
        },
        '&.Mui-disabled': {
          color: customColor.white,
          backgroundColor: '#f7b9ba',
          boxShadow: 'box-shadow: 0px 6.5px 9.75px rgba(181, 193, 199, 0.3)',
        },
      },
      containedSecondary: {
        '&:hover': {
          background:
            'linear-gradient(0deg, rgba(81, 99, 105, 0.3), rgba(81, 99, 105, 0.3)), rgba(81, 99, 105, 0.5)',
          boxShadow: '0px 6.5px 9.75px rgba(184, 196, 201, 0.5)',
        },
        '&.Mui-disabled': {
          color: customColor.white,
          backgroundColor: '#ced3d5',
          boxShadow: 'box-shadow: 0px 6.5px 9.75px rgba(181, 193, 199, 0.3)',
        },
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
