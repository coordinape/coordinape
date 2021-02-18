import { Theme } from "@material-ui/core/styles/createMuiTheme";

declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    custom: {
      appHeaderHeight: React.CSSProperties["height"];
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
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    custom: {
      appHeaderHeight: React.CSSProperties["height"];
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
