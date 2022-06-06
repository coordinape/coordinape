import _ from 'lodash';
import { colors as customColor } from 'stitches.config';

import { colors, createMuiTheme, responsiveFontSizes } from '@material-ui/core';

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

const shadows = [
  '0px 6.5px 9.75px #E6EAEC',
  '0px 6.5px 9.75px #DCE2E4',
  '0px 6.5px 9.75px #cbd0d2',
];

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
        color: customColor.secondaryText,
        '&:hover': {
          color: customColor.secondaryText + '80',
        },
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
        color: customColor.link,
        '&:hover': {
          color: customColor.link + '80',
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
      outlined: {
        color: customColor.text,
        background:
          'linear-gradient(180deg, rgba(237, 253, 254, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(237, 253, 254, 0) 100%) rgba(255, 255, 255, 0.9)',
        border: '0.3px solid rgba(132, 145, 149, 0.2)',
        boxShadow: '0px 6.5px 9.75px rgba(181, 193, 199, 0.3)',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.9)',
          border: '0.3px solid rgba(132, 145, 149, 0.2)',
          boxShadow: '0px 6.5px 9.75px rgba(184, 196, 201, 0.5)',
        },
      },
      contained: {
        color: 'white',
        backgroundColor: customColor.secondaryText,
        boxShadow: shadows[0],
        '&:hover': {
          backgroundColor: customColor.secondaryText,
          background: `linear-gradient(0deg, rgba(81, 99, 105, 0.3), rgba(81, 99, 105, 0.3)), ${customColor.secondaryText}`,
          boxShadow: shadows[1],
        },
        '&:active': {
          boxShadow: shadows[2],
        },
        '&.Mui-disabled': {
          color: 'white',
          backgroundColor: customColor.secondaryText + '80',
          boxShadow: shadows[0],
        },
      },
      containedPrimary: {
        backgroundColor: customColor.alert,
        '&:hover': {
          backgroundColor: customColor.alert,
          background: `linear-gradient(0deg, rgba(81, 99, 105, 0.1), rgba(81, 99, 105, 0.1)), ${customColor.alert}`,
          boxShadow: shadows[1],
        },
        '&.Mui-disabled': {
          color: 'white',
          backgroundColor: customColor.alert + '80',
          boxShadow: shadows[0],
        },
      },
      containedSecondary: {
        backgroundColor: customColor.text,
        '&:hover': {
          backgroundColor: customColor.text,
          background: `linear-gradient(0deg, rgba(17, 24, 25, 0.4), rgba(17, 24, 25, 0.4)), ${customColor.text}`,
          boxShadow: shadows[1],
        },
        '&.Mui-disabled': {
          color: 'white',
          backgroundColor: customColor.text + '80',
          boxShadow: shadows[0],
        },
      },
    },
    MuiStepIcon: {
      root: {
        '&.MuiStepIcon-active': {
          color: customColor.primary,
          '& .MuiStepIcon-text': {
            fill: 'white',
          },
        },
        '&.MuiStepIcon-completed': {
          color: customColor.complete,
          '& .MuiStepIcon-text': {
            fill: 'white',
          },
        },
      },
      text: {
        fill: customColor.border,
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
        border: '1px solid white',
        '&.Mui-selected': {
          backgroundColor: customColor.alert,
          color: 'white',
          border: `1px solid ${customColor.surface}`,
        },
        '&:hover': {
          backgroundColor: customColor.alert,
          color: 'white',
        },
        '&.Mui-selected:hover': {
          backgroundColor: customColor.alert,
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
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
      focus: 'rgba(255, 255, 255, 0.12)',
    },
    background: {
      default: customColor.background,
      dark: customColor.surface,
      paper: customColor.surface,
    },
    primary: {
      main: customColor.alert,
      dark: customColor.alertDark,
      contrastText: customColor.white,
    },
    secondary: {
      main: customColor.secondaryText,
      dark: customColor.border,
      contrastText: customColor.white,
    },
    text: {
      primary: customColor.text,
      secondary: customColor.secondaryText,
    },
    error: {
      main: customColor.alert,
    },
  },
  shadows: strongShadows,
};

export const createTheme = () => {
  const theme = createMuiTheme(
    _.merge({}, baseOptions, themeOptions, {
      custom: {
        appHeaderHeight: 82,
      },
      colors: customColor,
    }) as any
  );

  return responsiveFontSizes(theme);
};
