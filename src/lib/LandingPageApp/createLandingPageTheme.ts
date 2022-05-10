import merge from 'lodash/merge';

import { createMuiTheme } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

const fontFamilyDefault = ['Space Grotesk', 'sans-serif'];
const fontFamilyMono = ['Space Mono', 'sans-serif'];

export const colors = {
  white: '#fff',
  black: '#000',
  red: '#EF7376',
  text: '#516369',
  primary: '#5E6F74',
  almostWhite: '#F6F7F8',
  lightBlue: '#84C7CA',
  darkBlue: '#5D9C9F',
};

const palette = {
  type: 'light',
  background: {
    default: colors.white,
  },
  primary: {
    main: colors.primary,
  },
  secondary: {
    main: colors.red,
  },
  text: {
    primary: colors.text,
    secondary: '#99ff11',
  },
};

const typography = {
  button: {
    fontFamily: fontFamilyMono,
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.5,
  },
  fontFamily: fontFamilyDefault,
  fontFamilyMono,
};

const derivedTheme = (theme: Theme) => ({
  typography: {
    h2: {
      fontSize: 54,
      lineHeight: 1,
      fontWeight: 600,
      [theme.breakpoints.down('sm')]: {
        fontSize: 32,
        lineHeight: 1.25,
      },
    },
    h3: {
      fontSize: 40,
      lineHeight: 1.275,
      fontWeight: 600,
      [theme.breakpoints.down('sm')]: {
        fontSize: 32,
        lineHeight: 1.28125,
      },
    },
    h4: {
      fontSize: 40,
      lineHeight: 1.275,
      fontWeight: 700,
      [theme.breakpoints.down('sm')]: {
        fontSize: 24,
        lineHeight: 1.5,
      },
    },
    subtitle1: {
      fontSize: 23,
      lineHeight: 1.4782,
      fontWeight: 400,
      fontFamily: fontFamilyMono,
      [theme.breakpoints.down('sm')]: {
        fontSize: 15,
        lineHeight: 1.466,
      },
    },
    body1: {
      fontSize: 24,
      lineHeight: 1.5,
      fontWeight: 300,
      [theme.breakpoints.down('sm')]: {
        fontSize: 15,
        lineHeight: 1.6,
      },
    },
    body2: {
      fontSize: 18,
      lineHeight: 1.5,
      fontWeight: 400,
      fontFamily: fontFamilyMono,
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          color: colors.text,
        },
        a: {
          textDecoration: 'none',
        },
      },
    },
    MuiButton: {
      root: {
        textDecoration: 'none',
        textTransform: 'none',
        fontSize: 19,
        lineHeight: 1.26,
        padding: '12px 24px',
        borderRadius: '13px',
        fontFamily: fontFamilyDefault,
        '&:hover': {
          backgroundColor: 0,
        },
      },
      text: {
        color: colors.lightBlue,
        '&:hover': {
          color: colors.darkBlue,
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
        color: '#516369',
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
  },
});

const createTheme = () => {
  // Use for breakpoints
  const base = createMuiTheme({
    palette,
    typography,
    colors,
  } as any);

  return createMuiTheme(merge({}, base, derivedTheme(base)));
};

export default createTheme;
