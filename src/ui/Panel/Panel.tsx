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
        'input, textarea, button[role="radio"], button[role="combobox"], button[role="checkbox"], .formInputWrapper':
          {
            backgroundColor: '$surface !important',
            borderColor: 'transparent !important',
          },
        '.formInputWrapper input': {
          background: 'transparent !important',
        },
      },
    },
    invertForm: {
      true: {
        'input, textarea, button[role="radio"], button[role="combobox"], button[role="checkbox"]':
          {
            backgroundColor: '$surfaceNested',
            '&:disabled': {
              borderColor: '$borderMedium',
              background: 'transparent',
              opacity: 1,
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
        backgroundColor: '$success',
      },
    },
    alert: {
      true: {
        backgroundColor: '$alertLight',
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
