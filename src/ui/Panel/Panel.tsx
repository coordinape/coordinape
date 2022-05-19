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
  border: '1px solid $surface',
  padding: '$lg',

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
  },

  defaultVariants: {
    stack: true,
  },
});
