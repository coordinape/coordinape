import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { colors } from 'stitches.config';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    custom: {
      appHeaderHeight: number;
      appDrawerWidth: number;
    };
    colors: typeof colors;
    fontFamilyMono: string[];
  }
}
