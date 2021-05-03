import { Theme } from '@material-ui/core/styles/createMuiTheme';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    custom: {
      appHeaderHeight: number;
      appFooterHeight: number;
    };
    colors: {
      transparent: string;
      white: string;
      black: string;
      red: string;
      lightRed: string;
      mediumRed: string;
      lightGray: string;
      text: string;
      primary: string;
      secondary: string;
      third: string;
      selected: string;
      border: string;
      background: string;
    };
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    custom: {
      appHeaderHeight: number;
      appFooterHeight: number;
    };
    colors: {
      transparent: string;
      white: string;
      black: string;
      primary: string;
      secondary: string;
      third: string;
    };
  }
}
