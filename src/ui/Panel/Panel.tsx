import { css, styled } from 'stitches.config';

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
  'input, textarea, button[role="combobox"], .root .formInputWrapper, .formInputWrapper':
    {
      backgroundColor: '$formInputBackground',
      borderColor: '$formInputBorder',
      '&.Mui-error': {
        color: '$alert',
        background: '$formInputErrorBackground',
        borderColor: '$formInputErrorBorder',
        '+div span, span': {
          color: '$alert',
        },
        input: {
          color: '$formInputErrorText',
          background: 'transparent',
        },
      },
      '&:disabled': {
        opacity: 1,
      },
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
        backgroundColor: '$panelInfoBackground',
        color: '$panelInfoText',
      },
    },
    success: {
      true: {
        backgroundColor: '$tagSuccessBackground',
        color: '$tagSuccessText',
      },
    },
    alert: {
      true: {
        backgroundColor: '$tagAlertBackground',
        color: '$tagAlertText',
      },
    },
    neutral: {
      true: {
        backgroundColor: '$tagNeutralBackground',
        color: '$tagNeutralText',
      },
    },
    default: {
      true: {
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
