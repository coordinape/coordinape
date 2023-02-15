import { createStitches } from '@stitches/react';
import type * as Stitches from '@stitches/react';
export type { VariantProps } from '@stitches/react';

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
  black: newFigmaColors.grey10,
  link: newFigmaColors.secondary4,
  linkHover: newFigmaColors.secondary5,
  text: newFigmaColors.grey7,
  headingText: newFigmaColors.grey7,
  secondaryText: newFigmaColors.grey6,

  background: newFigmaColors.grey1,
  navBackground: newFigmaColors.grey3,
  surface: newFigmaColors.grey2,
  surfaceNested: newFigmaColors.grey1,
  navLinkText: newFigmaColors.grey7,
  navLinkHoverBackground: newFigmaColors.grey1,
  highlight: newFigmaColors.secondary1,
  hr: newFigmaColors.grey5,
  contentHeaderBorder: newFigmaColors.grey3,
  borderDim: newFigmaColors.grey4,
  border: newFigmaColors.grey5,
  borderContrast: newFigmaColors.grey6,
  borderFocus: newFigmaColors.secondary4,
  borderFocusBright: newFigmaColors.secondary5,
  borderTable: newFigmaColors.grey4,
  activePanel: newFigmaColors.secondary1,

  dim: newFigmaColors.grey1,
  dimButtonHover: '#FFFFFF',
  textOnDim: newFigmaColors.grey5,

  cta: newFigmaColors.secondary4,
  ctaDim: newFigmaColors.secondary5,
  ctaHover: '$ctaDim',
  textOnCta: newFigmaColors.grey1,

  primary: newFigmaColors.grey8,
  primaryHover: newFigmaColors.grey10,
  textOnPrimary: newFigmaColors.grey2,

  secondary: newFigmaColors.grey8,
  textOnSecondary: newFigmaColors.grey1,

  primaryButton: newFigmaColors.grey8,
  primaryButtonHover: newFigmaColors.grey10,
  primaryButtonText: newFigmaColors.grey2,
  primaryButtonBorderFocus: newFigmaColors.grey5,

  secondaryButton: '#ffffff22',
  secondaryButtonHover: newFigmaColors.grey10,
  secondaryButtonText: newFigmaColors.grey8,
  secondaryButtonTextHover: newFigmaColors.grey1,
  secondaryButtonBorderHover: newFigmaColors.grey10,
  secondaryButtonBorderFocus: newFigmaColors.grey8,

  destructiveButton: newFigmaColors.error6,
  destructiveButtonHover: newFigmaColors.error7,
  destructiveButtonText: newFigmaColors.error1,
  destructiveButtonBorderFocus: newFigmaColors.error5,

  successButton: newFigmaColors.success6,
  successButtonHover: newFigmaColors.success5,
  successButtonText: newFigmaColors.success1,
  successButtonBorderFocus: newFigmaColors.success5,

  neutralButton: '$primaryButton',
  neutralButtonOutlineBackground: newFigmaColors.grey1,
  neutralButtonOutlineText: '$primaryButton',
  neutralButtonHover: '$primaryButtonHover',
  neutralButtonText: newFigmaColors.grey1,
  neutralButtonTextHover: newFigmaColors.grey1,

  modalBackground: '#00000090',
  modalBorderColor: 'transparent',

  profileGradientStart: newFigmaColors.grey4,
  profileGradientEnd: newFigmaColors.grey2,

  alert: newFigmaColors.error5,
  success: newFigmaColors.success5,
  neutral: newFigmaColors.neutral4,
  complete: '$success',
  blurple: '#5865f2',

  avatarFallback: newFigmaColors.grey6,
  avatarFallbackText: newFigmaColors.grey2,

  toggleButtonYes: newFigmaColors.success5,
  toggleButtonNo: '$alert',

  toggleBackground: newFigmaColors.grey2,
  toggleText: newFigmaColors.grey6,
  toggleTextHover: newFigmaColors.grey9,
  toggleSelectedBackground: newFigmaColors.grey6,
  toggleSelectedText: newFigmaColors.grey1,

  formInputText: newFigmaColors.grey7,
  formInputBackground: '#FFFFFF66',
  formInputBorderlessBright: newFigmaColors.grey1,
  formInputBorder: newFigmaColors.grey6,
  formInputPlaceholder: newFigmaColors.grey4,
  formInputErrorText: newFigmaColors.error7,
  formInputErrorBackground: newFigmaColors.error1,
  formInputErrorBorder: newFigmaColors.error6,
  formInputSelectBackground: newFigmaColors.grey2,
  formInputSelectHover: newFigmaColors.grey1,
  formInputBorderFocus: newFigmaColors.secondary5,
  formRadioBorderUnselected: newFigmaColors.secondary2,
  formRadioBorderSelected: newFigmaColors.secondary5,
  formRadioBackground: newFigmaColors.grey2,

  panelInfoText: newFigmaColors.secondary9,
  panelInfoBackground: newFigmaColors.secondary1,

  tagActiveText: newFigmaColors.warning7,
  tagActiveBackground: newFigmaColors.warning2,

  tagWarningText: newFigmaColors.orange7,
  tagWarningBackground: newFigmaColors.orange2,

  tagSuccessText: newFigmaColors.success6,
  tagSuccessBackground: newFigmaColors.success2,

  tagAlertText: newFigmaColors.error5,
  tagAlertBackground: newFigmaColors.error2,

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

  // TODO: improve
  currentEpochDate: newFigmaColors.grey7,
  currentEpochDescription: newFigmaColors.grey7,
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
      display: 'Denim, apple-system, sans-serif',
    },
    fontSizes: {
      small: '14px',
      medium: '16px',
      large: '20px',
      h3: '24px',
      h2: '18px',
      h1: '26px',
      h1Temp: '26px',
      h2Temp: '18px',
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
    letterSpacings: {
      body: '0.01em',
      header: '0.02em',
    },
    textTransforms: {
      label: 'none',
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
      labelBold: '$semibold',
    },

    shadows: {
      shadow1: '0px 0px 8px rgba(81, 99, 105, 0.2)',
      shadow4: '0px 0px 3px 0px #0000001C, 0px 0px 16px 0px #0000001F',
      shadowBottom: '0px 6px 11px 0px #0000000d',
      heavy:
        '0px 0px 3px 0px #0000001C, 0px 0px 16px 0px #0000001F, 0px 0px 87px 0px #0000003D',
      toastifyShadow: '$shadow1',
      modalShadow: '$shadow1',
    },
    transitions: {
      quick: 'all 0.2s',
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
    ctaDim: newFigmaColors.primary6,
    ctaHover: '$ctaDim',
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
    neutralButtonOutlineBackground: newFigmaColors.grey9,
    neutralButtonOutlineText: newFigmaColors.grey4,
    neutralButtonHover: newFigmaColors.grey6,
    neutralButtonText: newFigmaColors.grey3,
    neutralButtonTextHover: newFigmaColors.grey8,

    secondary: newFigmaColors.secondary5,
    textOnSecondary: newFigmaColors.grey3,

    neutral: newFigmaColors.grey6,
    dim: newFigmaColors.grey8,
    dimButtonHover: newFigmaColors.grey9,
    textOnDim: newFigmaColors.grey5,
    modalBackground: '#0000007d',
    modalBorderColor: newFigmaColors.grey8,
    activePanel: newFigmaColors.grey8,

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
    linkHover: newFigmaColors.primary3,
    alert: newFigmaColors.error6,
    complete: newFigmaColors.success5,
    toggleButtonYes: '$cta',
    toggleButtonNo: '$alert',

    highlight: newFigmaColors.primary10,
    avatarFallback: newFigmaColors.grey7,
    avatarFallbackText: newFigmaColors.grey2,

    borderDim: newFigmaColors.grey8,
    border: newFigmaColors.grey7,
    borderContrast: newFigmaColors.grey6,
    contentHeaderBorder: newFigmaColors.grey7,
    borderFocus: newFigmaColors.primary5,
    borderFocusBright: newFigmaColors.primary3,
    borderTable: newFigmaColors.grey7,

    currentEpochDate: newFigmaColors.primary2,
    currentEpochDescription: newFigmaColors.primary6,

    panelInfoText: newFigmaColors.grey4,
    panelInfoBackground: newFigmaColors.grey7,

    tagActiveText: newFigmaColors.warning8,
    tagActiveBackground: newFigmaColors.warning10,

    tagWarningText: newFigmaColors.orange5,
    tagWarningBackground: newFigmaColors.orange10,

    tagSuccessText: newFigmaColors.success5,
    tagSuccessBackground: newFigmaColors.success10,

    tagAlertText: newFigmaColors.error6,
    tagAlertBackground: newFigmaColors.error10,

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
    formInputBorderlessBright: newFigmaColors.grey8,
    formInputBorder: newFigmaColors.grey7,
    formInputBorderFocus: newFigmaColors.primary4,
    formInputPlaceholder: newFigmaColors.grey6,
    formInputErrorText: newFigmaColors.error9,
    formInputErrorBackground: newFigmaColors.error4,
    formInputErrorBorder: newFigmaColors.error7,
    formRadioBorderUnselected: newFigmaColors.primary7,
    formRadioBorderSelected: newFigmaColors.primary4,
    formRadioBackground: newFigmaColors.primary10,
    formInputSelectBackground: newFigmaColors.grey8,
    formInputSelectHover: newFigmaColors.grey9,

    toggleBackground: newFigmaColors.grey8,
    toggleText: newFigmaColors.grey4,
    toggleTextHover: newFigmaColors.grey3,
    toggleSelectedBackground: newFigmaColors.grey6,
    toggleSelectedText: newFigmaColors.grey10,

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

    toastifyBackground: newFigmaColors.grey8,
    toastifyBorderColorDefault: newFigmaColors.grey6,
    toastifyBorderColorSuccess: newFigmaColors.success6,
    toastifyIconBackgroundSuccess: newFigmaColors.success10,
    toastifyTextColorError: newFigmaColors.error5,
    toastifyBorderColorError: newFigmaColors.error6,
    toastifyIconBackgroundError: newFigmaColors.error10,
    navLinkText: newFigmaColors.grey4,
    navLinkHoverBackground: newFigmaColors.grey8,
  },
  shadows: {
    shadow1: '0px 0px 35px 12px rgb(0 0 0 / 40%)',
    toastifyShadow: '0px 5px 25px -5px black',
    modalShadow: '0 5px 70px 28px black',
  },
});

export const lightx = createTheme({
  colors: {
    cta: 'orangered',
  },
});

export type Theme = 'dark' | undefined;

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
  body: {
    letterSpacing: '$body',
    color: '$text',
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
