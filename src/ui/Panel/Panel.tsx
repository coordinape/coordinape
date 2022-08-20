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
        backgroundColor: 'white',
      },
    },
    invertForm: {
      true: {
        'input, textarea, button[role="radio"], button[role="combobox"], button[role="checkbox"]':
          {
            backgroundColor: 'white',
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
        backgroundColor: '$info',
      },
    },
    success: {
      true: {
        backgroundColor: '$success',
      },
    },
  },

  defaultVariants: {
    stack: true,
  },
});
