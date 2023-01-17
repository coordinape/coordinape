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
  'input, textarea, button[role="radio"], button[role="combobox"], button[role="checkbox"], .root .formInputWrapper':
    {
      backgroundColor: 'transparent',
      borderColor: '$borderDim',
      '&:disabled': {
        opacity: 1,
      },
    },
  '.root .formInputWrapper': {
    borderColor: '$borderDim',
    '& input': {
      background: 'transparent',
    },
  },

  variants: {
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
        'input, textarea, button[role="radio"], button[role="combobox"], button[role="checkbox"], .root .formInputWrapper':
          {
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
        'input, textarea, button[role="radio"], button[role="combobox"], button[role="checkbox"], .root .formInputWrapper':
          {
            backgroundColor: '$surfaceNested',
            borderColor: 'transparent',
            '&:disabled': {
              borderColor: '$borderDim',
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
        backgroundColor: '$tagPrimaryBackground',
        color: '$tagPrimaryText',
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
