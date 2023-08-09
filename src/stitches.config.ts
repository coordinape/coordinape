import type * as Stitches from '@stitches/react';
import { createStitches } from '@stitches/react';

import { newColors as figmaColors } from 'ui/new-colors';

export type { VariantProps } from '@stitches/react';

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
  white: figmaColors.grey1,
  black: figmaColors.grey10,
  link: figmaColors.secondary4,
  linkHover: figmaColors.secondary5,
  text: figmaColors.grey7,
  headingText: figmaColors.grey7,
  secondaryText: figmaColors.grey6,

  background: figmaColors.grey1,
  navBackground: figmaColors.grey3,
  surface: figmaColors.grey2,
  surfaceNested: figmaColors.grey1,
  navLinkText: figmaColors.grey7,
  navLinkHoverBackground: figmaColors.grey1,
  highlight: figmaColors.secondary1,
  hr: figmaColors.grey5,
  contentHeaderBorder: figmaColors.grey3,
  borderDim: figmaColors.grey4,
  border: figmaColors.grey5,
  borderContrast: figmaColors.grey6,
  borderFocus: figmaColors.secondary4,
  borderFocusBright: figmaColors.secondary5,
  borderTable: figmaColors.grey4,
  activePanel: figmaColors.secondary1,

  dim: figmaColors.grey1,
  dimText: figmaColors.grey4,
  dimButtonHover: '#FFFFFF',
  textOnDim: figmaColors.grey5,

  cta: figmaColors.secondary4,
  ctaDim: figmaColors.secondary5,
  ctaHover: '$ctaDim',
  textOnCta: figmaColors.grey1,

  primary: figmaColors.grey8,
  primaryHover: figmaColors.grey10,
  textOnPrimary: figmaColors.grey2,

  secondary: figmaColors.grey8,
  textOnSecondary: figmaColors.grey1,

  primaryButton: figmaColors.grey8,
  primaryButtonHover: figmaColors.grey10,
  primaryButtonText: figmaColors.grey2,
  primaryButtonBorderFocus: figmaColors.grey5,

  secondaryButton: '#ffffff22',
  secondaryButtonHover: figmaColors.grey10,
  secondaryButtonText: figmaColors.grey8,
  secondaryButtonTextHover: figmaColors.grey1,
  secondaryButtonBorderHover: figmaColors.grey10,
  secondaryButtonBorderFocus: figmaColors.grey8,

  walletButton: figmaColors.grey1,
  walletButtonHover: figmaColors.grey10,
  walletButtonText: figmaColors.grey8,
  walletButtonTextHover: figmaColors.grey1,
  walletButtonBorderHover: figmaColors.grey10,
  walletButtonBorderFocus: figmaColors.grey8,

  destructiveButton: figmaColors.error6,
  destructiveButtonHover: figmaColors.error7,
  destructiveButtonText: figmaColors.error1,
  destructiveButtonBorderFocus: figmaColors.error5,

  successButton: figmaColors.success6,
  successButtonHover: figmaColors.success5,
  successButtonText: figmaColors.success1,
  successButtonBorderFocus: figmaColors.success5,

  neutralButton: figmaColors.grey6,
  neutralButtonOutlineBackground: figmaColors.grey1,
  neutralButtonOutlineText: '$primaryButton',
  neutralButtonHover: figmaColors.grey7,
  neutralButtonText: figmaColors.grey1,
  neutralButtonTextHover: figmaColors.grey1,

  reactionButtonBorderMine: figmaColors.secondary3,
  reactionButtonBorderHover: figmaColors.secondary5,
  reactionButton: figmaColors.neutral2,
  reactionButtonText: figmaColors.secondary4,
  reactionButtonTextHover: '$reactionButtonBorderHover',

  modalBackground: '#00000090',
  modalBorderColor: 'transparent',

  profileGradientStart: figmaColors.grey4,
  profileGradientEnd: figmaColors.grey2,

  alert: figmaColors.error5,
  warning: figmaColors.orange5,
  success: figmaColors.success5,
  neutral: figmaColors.neutral4,
  complete: '$success',
  blurple: '#5865f2',

  avatarFallback: figmaColors.grey6,
  avatarFallbackText: figmaColors.grey2,

  toggleButtonYes: figmaColors.success5,
  toggleButtonNo: '$alert',

  toggleBackground: figmaColors.grey2,
  toggleText: figmaColors.grey6,
  toggleTextHover: figmaColors.grey9,
  toggleSelectedBackground: figmaColors.grey6,
  toggleSelectedText: figmaColors.grey1,

  formInputText: figmaColors.grey7,
  formInputBackground: '#FFFFFF66',
  formInputBorderlessBright: figmaColors.grey1,
  formInputBorder: figmaColors.grey6,
  formInputPlaceholder: figmaColors.grey4,
  formInputErrorText: figmaColors.error7,
  formInputErrorBackground: figmaColors.error1,
  formInputErrorBorder: figmaColors.error6,
  formInputSelectBackground: figmaColors.grey2,
  formInputSelectHover: figmaColors.grey1,
  formInputBorderFocus: figmaColors.secondary5,
  formRadioBorderUnselected: figmaColors.secondary3,
  formRadioBorderSelected: figmaColors.secondary5,
  formRadioBackground: figmaColors.grey2,

  panelInfoText: figmaColors.secondary9,
  panelInfoBackground: figmaColors.secondary1,

  tagActiveText: figmaColors.warning7,
  tagActiveBackground: figmaColors.warning2,

  tagWarningText: figmaColors.orange7,
  tagWarningBackground: figmaColors.orange2,

  tagSuccessText: figmaColors.success6,
  tagSuccessBackground: figmaColors.success2,

  tagAlertText: figmaColors.error5,
  tagAlertBackground: figmaColors.error2,

  tagSecondaryText: figmaColors.secondary5,
  tagSecondaryBackground: figmaColors.secondary2,

  tagPrimaryText: figmaColors.primary7,
  tagPrimaryBackground: figmaColors.primary2,

  tagNeutralText: figmaColors.neutral6,
  tagNeutralBackground: figmaColors.neutral2,

  tagDefaultText: figmaColors.grey2,
  tagDefaultBackground: figmaColors.grey5,

  mapNodeHighlight: figmaColors.warning5,
  mapNodeMoreHighlight: figmaColors.warning3,
  mapGive: figmaColors.secondary8,
  mapReceive: figmaColors.secondary2,
  mapCirculate: figmaColors.secondary5,
  mapNode: figmaColors.grey10,
  mapGiveLink: figmaColors.success5,
  mapReceiveLink: figmaColors.orange6,
  mapNodeFade: '#00000020',
  mapLink: '#00000015',
  mapLinkDim: '#00000008',

  coMarkBackground: figmaColors.primary4,

  toastifyBackground: 'white',
  toastifyTextColorDefault: 'var(--colors-text)',
  toastifyBorderColorDefault: figmaColors.grey3,
  toastifyTextColorSuccess: figmaColors.success6,
  toastifyBorderColorSuccess: figmaColors.success4,
  toastifyIconBackgroundSuccess: figmaColors.success2,
  toastifyTextColorError: figmaColors.error6,
  toastifyBorderColorError: figmaColors.error3,
  toastifyIconBackgroundError: figmaColors.error2,

  // TODO: improve
  currentEpochDate: figmaColors.grey7,
  currentEpochDescription: figmaColors.grey7,
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
      large: '24px',
      p: '16px',
      h3: '$p',
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
    letterSpacings: {
      body: '0.01em',
      header: '0.02em',
      labelUppercase: '0.04em',
    },
    textTransforms: {
      label: 'none',
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: '$semibold',
      extrabold: '$semibold',
      black: '$semibold',
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
      coSoulGlow:
        'rgba(82, 43, 196, 0.4) 0px 0px .9375em 0.1875em, rgba(82, 43, 196, 0.5) 0px -0.09em .25em 0px',
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
    cta: figmaColors.primary4,
    ctaDim: figmaColors.primary6,
    ctaHover: '$ctaDim',
    textOnCta: figmaColors.primary10,

    primary: figmaColors.grey7,
    primaryHover: figmaColors.grey8,
    textOnPrimary: figmaColors.grey1,

    primaryButton: figmaColors.grey7,
    primaryButtonHover: figmaColors.grey8,
    primaryButtonText: figmaColors.grey1,
    primaryButtonBorderFocus: figmaColors.primary3,

    secondaryButton: figmaColors.grey8,
    secondaryButtonHover: figmaColors.grey9,
    secondaryButtonText: figmaColors.grey5,
    secondaryButtonTextHover: figmaColors.primary4,
    secondaryButtonBorderHover: figmaColors.primary4,
    secondaryButtonBorderFocus: figmaColors.primary3,

    walletButton: figmaColors.grey8,
    walletButtonHover: figmaColors.grey8,
    walletButtonText: figmaColors.grey5,
    walletButtonTextHover: figmaColors.primary4,
    walletButtonBorderHover: figmaColors.primary4,
    walletButtonBorderFocus: figmaColors.primary3,

    destructiveButton: figmaColors.error6,
    destructiveButtonHover: figmaColors.error5,
    destructiveButtonText: figmaColors.error1,
    destructiveButtonBorderFocus: figmaColors.error5,

    successButton: figmaColors.success6,
    successButtonHover: figmaColors.success5,
    successButtonText: figmaColors.success1,
    successButtonBorderFocus: figmaColors.success5,

    neutralButton: figmaColors.grey6,
    neutralButtonOutlineBackground: figmaColors.grey9,
    neutralButtonOutlineText: figmaColors.grey4,
    neutralButtonHover: figmaColors.grey5,
    neutralButtonText: figmaColors.grey9,
    neutralButtonTextHover: figmaColors.grey9,

    secondary: figmaColors.secondary5,
    textOnSecondary: figmaColors.grey3,

    neutral: figmaColors.grey6,
    dim: figmaColors.grey8,
    dimText: figmaColors.grey7,
    dimButtonHover: figmaColors.grey9,
    textOnDim: figmaColors.grey5,
    modalBackground: '#0000007d',
    modalBorderColor: figmaColors.grey8,
    activePanel: figmaColors.grey8,

    profileGradientStart: figmaColors.grey10,
    profileGradientEnd: figmaColors.grey8,

    background: figmaColors.grey10,
    navBackground: figmaColors.grey9,
    surface: figmaColors.grey9,
    surfaceNested: figmaColors.grey10,

    text: figmaColors.grey4,
    headingText: figmaColors.grey2,
    secondaryText: figmaColors.grey6,

    info: figmaColors.secondary10,
    textOnInfo: figmaColors.grey1,
    link: figmaColors.primary4,
    linkHover: figmaColors.primary3,
    alert: figmaColors.error6,
    warning: figmaColors.orange5,
    complete: figmaColors.success5,
    toggleButtonYes: '$cta',
    toggleButtonNo: '$alert',

    highlight: figmaColors.primary10,
    avatarFallback: figmaColors.grey7,
    avatarFallbackText: figmaColors.grey2,

    borderDim: figmaColors.grey8,
    border: figmaColors.grey7,
    borderContrast: figmaColors.grey6,
    contentHeaderBorder: figmaColors.grey7,
    borderFocus: figmaColors.primary5,
    borderFocusBright: figmaColors.primary3,
    borderTable: figmaColors.grey7,

    currentEpochDate: figmaColors.primary2,
    currentEpochDescription: figmaColors.primary6,

    panelInfoText: figmaColors.grey4,
    panelInfoBackground: figmaColors.grey7,

    tagActiveText: figmaColors.warning8,
    tagActiveBackground: figmaColors.warning10,

    tagWarningText: figmaColors.orange5,
    tagWarningBackground: figmaColors.orange10,

    tagSuccessText: figmaColors.success5,
    tagSuccessBackground: figmaColors.success10,

    tagAlertText: figmaColors.error6,
    tagAlertBackground: figmaColors.error10,

    tagPrimaryText: figmaColors.primary7,
    tagPrimaryBackground: figmaColors.primary9,

    tagSecondaryText: figmaColors.secondary3,
    tagSecondaryBackground: figmaColors.secondary8,

    tagNeutralText: figmaColors.neutral4,
    tagNeutralBackground: figmaColors.neutral8,

    tagDefaultText: figmaColors.grey2,
    tagDefaultBackground: figmaColors.grey7,

    formInputText: figmaColors.grey5,
    formInputBackground: figmaColors.grey9,
    formInputBorderlessBright: figmaColors.grey8,
    formInputBorder: figmaColors.grey7,
    formInputBorderFocus: figmaColors.primary4,
    formInputPlaceholder: figmaColors.grey6,
    formInputErrorText: figmaColors.error9,
    formInputErrorBackground: figmaColors.error4,
    formInputErrorBorder: figmaColors.error7,
    formRadioBorderUnselected: figmaColors.primary7,
    formRadioBorderSelected: figmaColors.primary4,
    formRadioBackground: figmaColors.primary10,
    formInputSelectBackground: figmaColors.grey8,
    formInputSelectHover: figmaColors.grey9,

    toggleBackground: figmaColors.grey8,
    toggleText: figmaColors.grey4,
    toggleTextHover: figmaColors.grey3,
    toggleSelectedBackground: figmaColors.grey6,
    toggleSelectedText: figmaColors.grey10,

    mapNodeHighlight: figmaColors.warning7,
    mapNodeMoreHighlight: figmaColors.warning4,
    mapGive: figmaColors.secondary8,
    mapReceive: figmaColors.secondary2,
    mapCirculate: figmaColors.secondary5,
    mapNode: figmaColors.grey2,
    mapGiveLink: figmaColors.success5,
    mapReceiveLink: figmaColors.orange6,
    mapNodeFade: '#FFFFFF20',
    mapLink: '#FFFFFF15',
    mapLinkDim: '#FFFFFF08',

    toastifyBackground: figmaColors.grey8,
    toastifyBorderColorDefault: figmaColors.grey6,
    toastifyBorderColorSuccess: figmaColors.success6,
    toastifyIconBackgroundSuccess: figmaColors.success10,
    toastifyTextColorError: figmaColors.error5,
    toastifyBorderColorError: figmaColors.error6,
    toastifyIconBackgroundError: figmaColors.error10,
    navLinkText: figmaColors.grey4,
    navLinkHoverBackground: figmaColors.grey8,

    reactionButtonBorderMine: figmaColors.primary7,
    reactionButtonBorderHover: figmaColors.primary3,
    reactionButton: figmaColors.neutral8,

    reactionButtonText: '$text',
    reactionButtonTextHover: '$reactionButtonBorderHover',
  },
  shadows: {
    shadow1: '0px 0px 35px 12px rgb(0 0 0 / 40%)',
    toastifyShadow: '0px 5px 25px -5px black',
    modalShadow: '0 5px 70px 28px black',
    coSoulGlow:
      'rgba(198, 219, 137, 0.5) 0px 0px .9375em 0.1875em, rgba(198, 219, 137, 0.5) 0px -0.09em .25em 0px',
  },
});

export type Theme = 'dark' | undefined;

export const disabledStyle = {
  pointerEvents: 'none',
  opacity: 0.35,
  cursor: 'default',
};

export const globalStyles = globalCss({
  '@font-face': [
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
