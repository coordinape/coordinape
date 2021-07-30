import merge from 'lodash/merge';

import { createMuiTheme } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

import colors from './colors';
import custom from './custom';

const fontFamilyDefault = ['Space Grotesk', 'sans-serif'];
const fontFamilyMono = ['Space Mono', 'sans-serif'];

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
        padding: '12px 24px',
        textTransform: 'none',
      },
      containedSecondary: {
        color: colors.white,
        borderRadius: '28px',
      },
      sizeSmall: {
        fontSize: 16,
        padding: '3px 12px',
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

  return createMuiTheme(merge({}, base, derivedTheme(base), { custom }));
};
export default createTheme;
