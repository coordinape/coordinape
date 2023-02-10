import { css, styled, disabledStyle } from 'stitches.config';

export const panelStyles = css({
  gridTemplateColumns: '1fr',
  mt: '$lg',
  alignItems: 'center',
  backgroundColor: '$surface',
  minHeight: '85vh',
  borderRadius: '$3',
});

const PanelBase = styled('div');

export const Panel = styled(PanelBase, {
  borderRadius: '$3',
  backgroundColor: '$surface',
  padding: '$md',
  border: '1px solid $borderDim',
  [`${PanelBase}`]: {
    // any nested panels shouldn't have border by default
    border: 'none',
  },
  // TODO clean up all these nested panel rules after theme migration
  'input, textarea, button[role="combobox"], .root .formInputWrapper': {
    backgroundColor: '$formInputBackground',
    borderColor: '$formInputBorder',
    transition: 'opacity 0.3s ease-in-out',
    '&:disabled': disabledStyle,
  },
  // TODO clean up all these nested panel rules after theme migration
  'input, textarea, button[role="combobox"], .root .formInputWrapper, .formInputWrapper, .MuiInputBase-root.Mui-disabled':
    {
      backgroundColor: '$formInputBackground',
      borderColor: '$formInputBorder',
      color: '$formInputText',
      '&:focus-within': {
        borderColor: '$borderFocus',
      },
      '&.Mui-error': {
        color: '$alert',
        background: '$formInputErrorBackground',
        borderColor: '$formInputErrorBorder',
        '+div span, span, a': {
          color: '$alert',
        },
        input: {
          color: '$formInputErrorText',
          background: 'transparent',
        },
      },
      "input[data-testid='FormTokenField']": {
        // keep the inner input from getting double opacitied
        opacity: '1 !important',
      },
      '&.Mui-disabled': disabledStyle,
    },
  '.root .formInputWrapper': {
    borderColor: '$formInputBorder',
    '& input': {
      background: 'transparent',
    },
  },
  variants: {
    selected: {
      true: {
        outline: '1px solid $borderFocusBright',
      },
    },
    ghost: {
      true: {
        padding: 0,
        background: 'transparent',
        borderRadius: 0,
        border: 'none',
      },
    },
    stack: {
      true: {
        display: 'flex',
        flexDirection: 'column',
      },
    },
    nested: {
      true: {
        padding: '$md',
        backgroundColor: '$surfaceNested',
        borderColor: 'transparent',
        'input, textarea, button[role="combobox"], .root .formInputWrapper': {
          backgroundColor: '$surface',
          borderColor: 'transparent',
          '&:focus-within ': {
            borderColor: '$cta',
          },
        },
        '.root .formInputWrapper': {
          borderColor: 'transparent',
          '& input': {
            background: 'transparent',
          },
        },
      },
    },
    invertForm: {
      true: {
        'input, textarea, button[role="combobox"], .root .formInputWrapper': {
          backgroundColor: '$surfaceNested',
          borderColor: 'transparent',
          '&:disabled': {
            borderColor: '$formInputBorder',
            opacity: 1,
          },
        },
        '.root .formInputWrapper': {
          borderColor: 'transparent',
          '& input': {
            background: 'transparent',
          },
        },
      },
    },
    info: {
      true: {
        border: 'none',
        backgroundColor: '$panelInfoBackground',
        color: '$panelInfoText',
      },
    },
    success: {
      true: {
        border: 'none',
        backgroundColor: '$tagSuccessBackground',
        color: '$tagSuccessText',
      },
    },
    alert: {
      true: {
        border: 'none',
        backgroundColor: '$tagAlertBackground',
        color: '$tagAlertText',
        'h1, h2': {
          color: '$alert',
        },
      },
    },
    neutral: {
      true: {
        border: 'none',
        backgroundColor: '$tagNeutralBackground',
        color: '$tagNeutralText',
      },
    },
    default: {
      true: {
        border: 'none',
        backgroundColor: '$tagDefaultBackground',
        color: '$tagDefaultText',
      },
    },
    background: {
      true: {
        backgroundColor: '$background',
      },
    },
  },

  defaultVariants: {
    stack: true,
  },
});
