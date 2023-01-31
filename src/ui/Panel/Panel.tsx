import { css, styled } from '../../stitches.config';

export const panelStyles = css({
  gridTemplateColumns: '1fr',
  mt: '$lg',
  alignItems: 'center',
  backgroundColor: '$surface',
  minHeight: '85vh',
  borderRadius: '$3',
});

export const Panel = styled('div', {
  borderRadius: '$3',
  backgroundColor: '$surface',
  padding: '$md',
  // TODO clean up all these nested panel rules after theme migration
  'input, textarea, button[role="combobox"], .root .formInputWrapper': {
    backgroundColor: '$formInputBackground',
    borderColor: '$formInputBorder',
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
