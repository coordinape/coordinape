import { createStitches } from '@stitches/react';
import type * as Stitches from '@stitches/react';
export type { VariantProps } from '@stitches/react';

import { colors as figmaColors } from 'ui/colors';
import { newColors as newFigmaColors } from 'ui/new-colors';

// FIXME these don't match the Material-UI breakpoints
export const MediaQueryKeys = {
  xs: '(max-width: 520px)',
  sm: '(max-width: 960px)',
  md: '(max-width: 1300px)',
  lg: '(max-width: 1800px)',
} as const;

// SVGIcon config

export const SvgIconConfig = {
  variants: {
    size: {
      sm: {
        width: '$sm',
        height: '$sm',
      },
      md: {
        width: '$md',
        height: '$md',
      },
      lg: {
        width: '$lg',
        height: '$lg',
      },
      xl: {
        width: '$xl',
        height: '$xl',
      },
      inherit: {
        width: 'inherit',
        height: 'inherit',
      },
    },
    color: {
      default: { color: '$text' },
      neutral: { color: '$neutral' },
      alert: { color: '$alert' },
      primary: { color: '$primary' },
      white: { color: '$white' },
      complete: { color: '$complete' },
    },
  },
  defaultVariants: {
    size: 'lg',
  },
};

const spaces = {
  xxs: '2px',
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '1xl': '40px',
  '2xl': '48px',
  '3xl': '60px',
  '4xl': '88px',
};

export const colors = {
  white: newFigmaColors.grey1,
  black: '#000',
  tempPrimaryHover: '#029fff',

  cta: figmaColors.blue12,
  ctaHover: '$tempPrimaryHover',
  textOnCta: newFigmaColors.grey1,

  primary: figmaColors.blue12,
  primaryHover: '$tempPrimaryHover',
  primaryDark: figmaColors.blue24,
  primaryLight: figmaColors.blue1,
  primaryDisabled: figmaColors.blue4,
  textOnPrimary: newFigmaColors.grey1,

  primaryButton: '$primary',
  primaryButtonHover: '$tempPrimaryHover',
  primaryButtonText: newFigmaColors.grey1,
  primaryButtonBorderFocus: figmaColors.blue8,

  secondaryButton: 'transparent',
  secondaryButtonHover: '$tempPrimaryHover',
  secondaryButtonText: '$primary',
  secondaryButtonTextHover: '$white',
  secondaryButtonBorderHover: '$tempPrimaryHover',
  secondaryButtonBorderFocus: figmaColors.blue8,

  destructiveButton: newFigmaColors.error6,
  destructiveButtonHover: newFigmaColors.error5,
  destructiveButtonText: newFigmaColors.error1,
  destructiveButtonBorderFocus: newFigmaColors.error5,

  successButton: newFigmaColors.success6,
  successButtonHover: newFigmaColors.success5,
  successButtonText: newFigmaColors.success1,
  successButtonBorderFocus: newFigmaColors.success5,

  neutralButton: '$primary',
  neutralButtonHover: '$primaryHover',
  neutralButtonText: newFigmaColors.grey1,
  neutralButtonTextHover: newFigmaColors.grey1,

  secondary: '$primary',
  secondaryHover: '$tempPrimaryHover',
  secondaryLight: figmaColors.blue4,
  secondaryMedium: figmaColors.blue8,
  secondaryDark: figmaColors.blue4,
  textOnSecondary: newFigmaColors.grey1,

  modalBackground: '#00000090',
  modalBorderColor: 'transparent',

  profileGradientStart: newFigmaColors.grey4,
  profileGradientEnd: newFigmaColors.grey2,

  alert: figmaColors.red12,
  alertLight: figmaColors.red1,
  alertDisabled: figmaColors.red4,
  alertDark: figmaColors.red20,
  textOnAlert: newFigmaColors.grey1,

  success: figmaColors.green12,
  successLight: figmaColors.green1,
  successDisabled: figmaColors.green4,
  successDark: figmaColors.green16,

  neutral: figmaColors.grey12,
  textOnNeutral: figmaColors.grey1,

  dim: newFigmaColors.grey1,
  dimButtonHover: '#ffffff',
  textOnDim: '$primary',

  complete: figmaColors.green12,
  completeLight: figmaColors.green1,
  blurple: figmaColors.discordblurple,

  background: figmaColors.grey1,
  navBackground: figmaColors.grey16,
  surface: figmaColors.grey2,
  surfaceNested: 'white',
  info: figmaColors.blue4,
  textOnInfo: figmaColors.grey20,

  border: figmaColors.grey4,
  hr: figmaColors.grey4,
  contentHeaderBorder: 'transparent',
  borderMedium: newFigmaColors.grey5,
  borderDim: newFigmaColors.grey4,
  borderFocus: '$primary',
  borderFocusBright: '$primary',

  highlight: figmaColors.blue1,
  avatarFallback: newFigmaColors.grey3,
  avatarFallbackText: newFigmaColors.grey8,

  link: '$primary',
  text: figmaColors.grey20,
  headingText: figmaColors.grey16,
  secondaryText: figmaColors.grey10,

  panelInfoText: figmaColors.grey16,
  panelInfoBackground: figmaColors.blue4,

  tagActiveText: figmaColors.yellow20,
  tagActiveBackground: figmaColors.yellow4,

  tagSuccessText: newFigmaColors.success7,
  tagSuccessBackground: newFigmaColors.success3,

  tagAlertText: figmaColors.red16,
  tagAlertBackground: figmaColors.red4,

  tagWarningText: newFigmaColors.orange6,
  tagWarningBackground: newFigmaColors.orange2,

  tagPrimaryText: '$primary',
  tagPrimaryBackground: figmaColors.blue4,

  tagSecondaryText: '$primary',
  tagSecondaryBackground: figmaColors.blue4,

  tagNeutralText: newFigmaColors.neutral7,
  tagNeutralBackground: newFigmaColors.neutral2,

  tagDefaultText: newFigmaColors.grey2,
  tagDefaultBackground: newFigmaColors.grey7,

  formInputText: figmaColors.grey16,
  formInputBackground: 'white',
  formInputBorder: figmaColors.grey4,
  formInputPlaceholder: figmaColors.grey8,
  formInputErrorText: newFigmaColors.error7,
  formInputErrorBackground: newFigmaColors.error1,
  formInputErrorBorder: newFigmaColors.error6,

  mapNodeHighlight: '$primary',
  mapNodeMoreHighlight: figmaColors.teal8,
  mapGive: figmaColors.green8,
  mapReceive: figmaColors.orange12,
  mapCirculate: figmaColors.yellow12,
  mapNode: '#000000',
  mapNodeFade: '#00000020',
  mapGiveLink: figmaColors.green4,
  mapReceiveLink: figmaColors.orange8,
  mapLink: '#00000015',
  mapLinkDim: '#00000008',

  coMarkBackground: newFigmaColors.primary4,

  toastifyBackground: 'white',
  toastifyTextColorDefault: 'var(--colors-text)',
  toastifyBorderColorDefault: newFigmaColors.grey3,
  toastifyTextColorSuccess: newFigmaColors.success6,
  toastifyBorderColorSuccess: newFigmaColors.success4,
  toastifyIconBackgroundSuccess: newFigmaColors.success2,
  toastifyTextColorError: newFigmaColors.error6,
  toastifyBorderColorError: newFigmaColors.error3,
  toastifyIconBackgroundError: newFigmaColors.error2,
  navLinkText: newFigmaColors.grey2,

  // TODO: improve
  currentEpochDate: figmaColors.grey20,
  currentEpochDescription: figmaColors.grey20,
};

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors,
    space: {
      ...spaces,
    },
    sizes: {
      max: 'max-content',
      min: 'min-content',
      full: '100%',
      smallScreen: '900px',
      mediumScreen: '1392px',
      headerHeight: '91px',
      ...spaces,
    },
    radii: {
      1: '4px',
      2: '6px',
      3: '8px',
      4: '10px',
      round: '50%',
      pill: '9999px',
    },
    fonts: {
      display: 'Inter, apple-system, sans-serif',
      // to make more obvious for testing
      // display: 'Times New Roman, apple-system, sans-serif',
    },
    fontSizes: {
      small: '13px',
      medium: '16px',
      large: '20px',
      h3: '24px',
      h2: '32px',
      h1: '48px',
    },
    fontWeights: {
      hairline: 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
      labelBold: '$bold',
    },
    lineHeights: {
      none: 1,
      shorter: 1.25,
      short: 1.375,
      base: 1.5,
      tall: 1.625,
      tall2: 1.75,
      taller: '2',
    },
    shadows: {
      shadow1: '0px 0px 8px rgba(81, 99, 105, 0.2)',
      shadow4: '0px 0px 3px 0px #0000001C, 0px 0px 16px 0px #0000001F',
      shadowBottom: '0px 6px 11px 0px #0000000d',
      heavy:
        '0px 0px 3px 0px #0000001C, 0px 0px 16px 0px #0000001F, 0px 0px 87px 0px #0000003D',
    },
    transitions: {
      quick: 'all 0.2s',
    },
    toastify: {
      'color-progress-light': 'var(--colors-text) !important',
      'color-progress-success': 'var(--toastify-text-color-success) !important',
      'color-progress-error': 'var(--toastify-text-color-error) !important',
    },
    textTransforms: {
      label: 'uppercase',
    },
  },
  media: {
    ...MediaQueryKeys,
    motion: '(prefers-reduced-motion)',
    hover: '(any-hover: hover)',
    dark: '(prefers-color-scheme: dark)',
    light: '(prefers-color-scheme: light)',
  },
  utils: {
    p: (value: Stitches.PropertyValue<'padding'>) => ({
      padding: value,
    }),
    pt: (value: Stitches.PropertyValue<'paddingTop'>) => ({
      paddingTop: value,
    }),
    pr: (value: Stitches.PropertyValue<'paddingRight'>) => ({
      paddingRight: value,
    }),
    pb: (value: Stitches.PropertyValue<'paddingBottom'>) => ({
      paddingBottom: value,
    }),
    pl: (value: Stitches.PropertyValue<'paddingLeft'>) => ({
      paddingLeft: value,
    }),
    px: (value: Stitches.PropertyValue<'paddingLeft'>) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value: Stitches.PropertyValue<'paddingTop'>) => ({
      paddingTop: value,
      paddingBottom: value,
    }),

    m: (value: Stitches.PropertyValue<'margin'>) => ({
      margin: value,
    }),
    mt: (value: Stitches.PropertyValue<'marginTop'>) => ({
      marginTop: value,
    }),
    mr: (value: Stitches.PropertyValue<'marginRight'>) => ({
      marginRight: value,
    }),
    mb: (value: Stitches.PropertyValue<'marginBottom'>) => ({
      marginBottom: value,
    }),
    ml: (value: Stitches.PropertyValue<'marginLeft'>) => ({
      marginLeft: value,
    }),
    mx: (value: Stitches.PropertyValue<'marginLeft'>) => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: (value: Stitches.PropertyValue<'marginTop'>) => ({
      marginTop: value,
      marginBottom: value,
    }),

    userSelect: (value: Stitches.PropertyValue<'userSelect'>) => ({
      WebkitUserSelect: value,
      userSelect: value,
    }),
    size: (value: Stitches.PropertyValue<'width'>) => ({
      width: value,
      height: value,
    }),
    appearance: (value: Stitches.PropertyValue<'appearance'>) => ({
      WebkitAppearance: value,
      appearance: value,
    }),
    backgroundClip: (value: Stitches.PropertyValue<'backgroundClip'>) => ({
      WebkitBackgroundClip: value,
      backgroundClip: value,
    }),
  },
});

export const dark = createTheme({
  colors: {
    cta: newFigmaColors.primary4,
    ctaHover: newFigmaColors.primary6,
    textOnCta: newFigmaColors.primary10,

    primary: newFigmaColors.grey7,
    primaryHover: newFigmaColors.grey8,
    textOnPrimary: newFigmaColors.grey1,

    primaryButton: newFigmaColors.grey7,
    primaryButtonHover: newFigmaColors.grey8,
    primaryButtonText: newFigmaColors.grey1,
    primaryButtonBorderFocus: newFigmaColors.primary3,

    secondaryButton: newFigmaColors.grey8,
    secondaryButtonHover: newFigmaColors.grey9,
    secondaryButtonText: newFigmaColors.grey5,
    secondaryButtonTextHover: newFigmaColors.primary4,
    secondaryButtonBorderHover: newFigmaColors.primary4,
    secondaryButtonBorderFocus: newFigmaColors.primary3,

    destructiveButton: newFigmaColors.error6,
    destructiveButtonHover: newFigmaColors.error5,
    destructiveButtonText: newFigmaColors.error1,
    destructiveButtonBorderFocus: newFigmaColors.error5,

    successButton: newFigmaColors.success6,
    successButtonHover: newFigmaColors.success5,
    successButtonText: newFigmaColors.success1,
    successButtonBorderFocus: newFigmaColors.success5,

    neutralButton: newFigmaColors.grey7,
    neutralButtonHover: newFigmaColors.grey8,
    neutralButtonText: newFigmaColors.grey4,
    neutralButtonTextHover: newFigmaColors.grey4,

    secondary: newFigmaColors.secondary5,
    secondaryMedium: newFigmaColors.secondary7,
    secondaryDark: newFigmaColors.secondary9,
    textOnSecondary: newFigmaColors.grey3,

    neutral: newFigmaColors.grey7,
    textOnNeutral: newFigmaColors.grey4,
    dim: newFigmaColors.grey8,
    dimButtonHover: newFigmaColors.grey9,
    textOnDim: newFigmaColors.grey5,
    modalBackground: '#0000007d',
    modalBorderColor: newFigmaColors.grey8,

    profileGradientStart: newFigmaColors.grey10,
    profileGradientEnd: newFigmaColors.grey8,

    background: newFigmaColors.grey10,
    navBackground: newFigmaColors.grey9,
    surface: newFigmaColors.grey9,
    surfaceNested: newFigmaColors.grey10,

    text: newFigmaColors.grey4,
    headingText: newFigmaColors.grey2,
    secondaryText: newFigmaColors.grey6,

    info: newFigmaColors.secondary10,
    textOnInfo: newFigmaColors.grey1,
    link: newFigmaColors.primary4,
    alert: newFigmaColors.error6,
    complete: newFigmaColors.success5,

    highlight: newFigmaColors.primary10,
    avatarFallback: newFigmaColors.grey7,
    avatarFallbackText: newFigmaColors.grey2,

    border: newFigmaColors.grey9,
    borderMedium: newFigmaColors.grey6,
    borderDim: newFigmaColors.grey7,
    contentHeaderBorder: newFigmaColors.grey7,
    borderFocus: newFigmaColors.primary5,
    borderFocusBright: newFigmaColors.primary3,

    currentEpochDate: newFigmaColors.primary2,
    currentEpochDescription: newFigmaColors.primary6,

    panelInfoText: newFigmaColors.grey4,
    panelInfoBackground: newFigmaColors.grey7,

    tagActiveText: newFigmaColors.warning8,
    tagActiveBackground: newFigmaColors.warning10,

    tagSuccessText: newFigmaColors.success5,
    tagSuccessBackground: newFigmaColors.success10,

    tagAlertText: newFigmaColors.error6,
    tagAlertBackground: newFigmaColors.error10,

    tagWarningText: newFigmaColors.orange5,
    tagWarningBackground: newFigmaColors.orange10,

    tagPrimaryText: newFigmaColors.primary7,
    tagPrimaryBackground: newFigmaColors.primary9,

    tagSecondaryText: newFigmaColors.secondary8,
    tagSecondaryBackground: newFigmaColors.secondary3,

    tagNeutralText: newFigmaColors.neutral4,
    tagNeutralBackground: newFigmaColors.neutral8,

    tagDefaultText: newFigmaColors.grey2,
    tagDefaultBackground: newFigmaColors.grey7,

    formInputText: newFigmaColors.grey5,
    formInputBackground: newFigmaColors.grey9,
    formInputBorder: newFigmaColors.grey7,
    formInputPlaceholder: newFigmaColors.grey6,
    formInputErrorText: newFigmaColors.error9,
    formInputErrorBackground: newFigmaColors.error4,
    formInputErrorBorder: newFigmaColors.error7,

    mapNodeHighlight: newFigmaColors.warning7,
    mapNodeMoreHighlight: newFigmaColors.warning4,
    mapGive: newFigmaColors.secondary8,
    mapReceive: newFigmaColors.secondary2,
    mapCirculate: newFigmaColors.secondary5,
    mapNode: newFigmaColors.grey2,
    mapGiveLink: newFigmaColors.success5,
    mapReceiveLink: newFigmaColors.orange6,
    mapNodeFade: '#FFFFFF20',
    mapLink: '#FFFFFF15',
    mapLinkDim: '#FFFFFF08',

    toastifyBackground: newFigmaColors.grey9,
    toastifyBorderColorDefault: newFigmaColors.grey6,
    toastifyBorderColorSuccess: newFigmaColors.success6,
    toastifyIconBackgroundSuccess: newFigmaColors.success10,
    toastifyTextColorError: newFigmaColors.error5,
    toastifyBorderColorError: newFigmaColors.error6,
    toastifyIconBackgroundError: newFigmaColors.error10,
    navLinkText: newFigmaColors.grey4,
    navLinkHoverBackground: newFigmaColors.grey8,
  },
  fontSizes: {
    small: '13px',
    medium: '16px',
    large: '20px',
    h3: '24px',
    h2: '18px',
    h1: '26px',
  },
  lineHeights: {
    none: 1,
    shorter: '120%',
    short: 1.375,
    base: 1.5,
    tall: 1.625,
    tall2: 1.75,
    taller: '2',
  },
  fonts: {
    display: 'Denim, apple-system, sans-serif',
  },
  fontWeights: {
    labelBold: '$semibold',
  },
  textTransforms: {
    label: 'none',
  },
});

export const light = createTheme({
  colors: {
    background: newFigmaColors.grey1,
    navBackground: newFigmaColors.grey3,
    surface: newFigmaColors.grey2,
    surfaceNested: newFigmaColors.grey1,
    navLinkText: newFigmaColors.grey7,
    navLinkHoverBackground: newFigmaColors.grey1,

    profileGradientStart: newFigmaColors.grey4,
    profileGradientEnd: newFigmaColors.grey2,

    link: newFigmaColors.secondary5,
    borderFocus: newFigmaColors.secondary4,

    avatarFallback: newFigmaColors.grey6,
    avatarFallbackText: newFigmaColors.grey2,

    cta: newFigmaColors.secondary4,
    ctaHover: newFigmaColors.secondary5,
    textOnCta: newFigmaColors.grey1,

    primary: newFigmaColors.grey8,
    primaryHover: newFigmaColors.grey7,
    textOnPrimary: newFigmaColors.grey4,
    primaryButtonHover: newFigmaColors.grey7,
    primaryButtonBorderFocus: newFigmaColors.grey7,

    secondaryButton: '#ffffff22',
    secondaryButtonHover: newFigmaColors.grey10,
    secondaryButtonText: newFigmaColors.grey9,
    secondaryButtonTextHover: newFigmaColors.grey1,
    secondaryButtonBorderHover: newFigmaColors.grey10,
    secondaryButtonBorderFocus: newFigmaColors.grey8,

    panelInfoText: newFigmaColors.secondary9,
    panelInfoBackground: newFigmaColors.secondary1,

    tagActiveText: newFigmaColors.orange7,
    tagActiveBackground: newFigmaColors.orange2,

    tagSuccessText: newFigmaColors.success6,
    tagSuccessBackground: newFigmaColors.success2,

    tagAlertText: newFigmaColors.error5,
    tagAlertBackground: newFigmaColors.error2,

    tagWarningText: newFigmaColors.warning6,
    tagWarningBackground: newFigmaColors.warning2,

    tagSecondaryText: newFigmaColors.secondary5,
    tagSecondaryBackground: newFigmaColors.secondary1,

    tagPrimaryText: newFigmaColors.primary7,
    tagPrimaryBackground: newFigmaColors.primary2,

    tagNeutralText: newFigmaColors.neutral6,
    tagNeutralBackground: newFigmaColors.neutral2,

    tagDefaultText: newFigmaColors.grey2,
    tagDefaultBackground: newFigmaColors.grey5,

    mapNodeHighlight: newFigmaColors.warning5,
    mapNodeMoreHighlight: newFigmaColors.warning3,
    mapGive: newFigmaColors.secondary8,
    mapReceive: newFigmaColors.secondary2,
    mapCirculate: newFigmaColors.secondary5,
    mapNode: newFigmaColors.grey10,
    mapGiveLink: newFigmaColors.success5,
    mapReceiveLink: newFigmaColors.orange6,
    mapNodeFade: '#00000020',
    mapLink: '#00000015',
    mapLinkDim: '#00000008',
  },
  fonts: {
    display: 'Denim, apple-system, sans-serif',
  },
});

export type Theme = 'dark' | 'light' | undefined;

export const disabledStyle = {
  pointerEvents: 'none',
  opacity: 0.4,
  cursor: 'default',
};

export const globalStyles = globalCss({
  '@font-face': [
    {
      fontFamily: 'Denim',
      fontWeight: 300,
      src: 'url("/fonts/Denim-Medium.woff2")',
    },
    {
      fontFamily: 'Denim',
      fontWeight: 300,
      fontStyle: 'italic',
      src: 'url("/fonts/Denim-MediumItalic.woff2")',
    },
    {
      fontFamily: 'Denim',
      fontWeight: 400,
      src: 'url("/fonts/Denim-Regular.woff2")',
    },
    {
      fontFamily: 'Denim',
      fontWeight: 400,
      fontStyle: 'italic',
      src: 'url("/fonts/Denim-RegularItalic.woff2")',
    },
    {
      // Looking at the fonts, Medium is thicker than regular
      fontFamily: 'Denim',
      fontWeight: 500,
      src: 'url("/fonts/Denim-Medium.woff2")',
    },
    {
      fontFamily: 'Denim',
      fontWeight: 500,
      fontStyle: 'italic',
      src: 'url("/fonts/Denim-MediumItalic.woff2")',
    },
    {
      fontFamily: 'Denim',
      fontWeight: 600,
      src: 'url("/fonts/Denim-SemiBold.woff2")',
    },
    {
      fontFamily: 'Denim',
      fontWeight: 600,
      fontStyle: 'italic',
      src: 'url("/fonts/Denim-SemiBoldItalic.woff2")',
    },
    {
      fontFamily: 'Denim',
      fontWeight: 700,
      src: 'url("/fonts/Denim-Bold.woff2")',
    },
    {
      fontFamily: 'Denim',
      fontWeight: 700,
      fontStyle: 'italic',
      src: 'url("/fonts/Denim-BoldItalic.woff2")',
    },
  ],
  '*': {
    fontFamily: '$display',
  },
  // a11y keyboard navigation
  'a:focus-visible, button:focus-visible, [tabindex="0"]:focus-visible': {
    outline: '2px solid $borderFocus',
    outlineOffset: '1px',
  },
  'input, textarea': {
    appearance: 'none',
    borderWidth: 0,
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    margin: '0',
    outline: 'none',
    padding: '0',
    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
    '&::before': {
      boxSizing: 'border-box',
    },
    '&::after': {
      boxSizing: 'border-box',
    },
  },
  button: {
    all: 'unset',
    alignItems: 'center',
    boxSizing: 'border-box',
    userSelect: 'none',
    '&::before': {
      boxSizing: 'border-box',
    },
    '&::after': {
      boxSizing: 'border-box',
    },
  },
  'div, hr': {
    boxSizing: 'border-box',
  },
  img: {
    verticalAlign: 'middle',
    maxWidth: '100%',
  },
});

export type CSS = Stitches.CSS<typeof config>;
