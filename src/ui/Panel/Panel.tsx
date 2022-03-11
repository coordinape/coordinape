import { css, styled } from '../../stitches.config';

export const panelStyles = css({
  gridTemplateColumns: '1fr',
  mt: '$lg',
  alignItems: 'center',
  backgroundColor: '$surfaceGray',
  minHeight: '85vh',
  borderRadius: '$3',
});

export const Panel = styled('div', {
  borderRadius: '$3',
  backgroundColor: '$surfaceGray',

  variants: {
    variant: {
      stack: {
        padding: '$lg',
        display: 'flex',
        flexDirection: 'column',
      },
    },
  },

  defaultVariants: {
    variant: 'stack',
  },
});
