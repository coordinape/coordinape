import { Theme } from '@material-ui/core/styles/createMuiTheme';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    custom: {
      appHeaderHeight: number;
      appFooterHeight: number;
      appDrawerWidth: number;
    };
    colors: {
      transparent: string;
      white: string;
      black: string;
      red: string;
      lightRed: string;
      mediumRed: string;
      darkRed: string;
      lightGray: string;
      mediumGray: string;
      text: string;
      primary: string;
      secondary: string;
      third: string;
      selected: string;
      border: string;
      lightBorder: string;
      background: string;
      lightBackground: string;
      almostWhite: string;
      lightBlue: string;
      placeholder: string;
    };
    fontFamilyMono: string[];
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    custom: {
      appHeaderHeight: number;
      appFooterHeight: number;
      appDrawerWidth: number;
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
