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
        color: customColor.mediumGray,
        '&:hover': {
          color: customColor.mediumGray + '80',
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
        color: customColor.lightBlue,
        '&:hover': {
          color: customColor.lightBlue + '80',
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
        backgroundColor: customColor.mediumGray,
        boxShadow: shadows[0],
        '&:hover': {
          backgroundColor: customColor.mediumGray,
          background: `linear-gradient(0deg, rgba(81, 99, 105, 0.3), rgba(81, 99, 105, 0.3)), ${customColor.mediumGray}`,
          boxShadow: shadows[1],
        },
        '&:active': {
          boxShadow: shadows[2],
        },
        '&.Mui-disabled': {
          color: 'white',
          backgroundColor: customColor.mediumGray + '80',
          boxShadow: shadows[0],
        },
      },
      containedPrimary: {
        backgroundColor: customColor.red,
        '&:hover': {
          backgroundColor: customColor.red,
          background: `linear-gradient(0deg, rgba(81, 99, 105, 0.1), rgba(81, 99, 105, 0.1)), ${customColor.red}`,
          boxShadow: shadows[1],
        },
        '&.Mui-disabled': {
          color: 'white',
          backgroundColor: customColor.red + '80',
          boxShadow: shadows[0],
        },
      },
      containedSecondary: {
        backgroundColor: customColor.neutralGrayDark,
        '&:hover': {
          backgroundColor: customColor.neutralGrayDark,
          background: `linear-gradient(0deg, rgba(17, 24, 25, 0.4), rgba(17, 24, 25, 0.4)), ${customColor.neutralGrayDark}`,
          boxShadow: shadows[1],
        },
        '&.Mui-disabled': {
          color: 'white',
          backgroundColor: customColor.neutralGrayDark + '80',
          boxShadow: shadows[0],
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
          color: customColor.green,
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
        border: `1px solid ${customColor.lightBackground}`,
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
      dark: customColor.darkRed,
      contrastText: 'white',
    },
    secondary: {
      main: customColor.mediumGray,
      dark: customColor.border,
      contrastText: 'white',
    },
    text: {
      primary: customColor.primary,
      secondary: customColor.secondary,
    },
    error: {
      main: customColor.red,
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
      {
        custom: {
          appHeaderHeight: 82,
          appDrawerWidth: 375,
        },
      },
      { colors: customColor }
    ) as any
  );

  theme = responsiveFontSizes(theme);

  return theme;
};
