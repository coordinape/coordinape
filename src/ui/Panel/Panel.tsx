import { css, styled } from '../../stitches.config';

export const panelStyles = css({
  gridTemplateColumns: '1fr',
  mt: '$lg',
  alignItems: 'center',
  backgroundColor: '$gray',
  minHeight: '$bg',
  borderRadius: '$3',
  '& > *': {
    alignSelf: 'start',
  },
  '& .MuiSkeleton-root': {
    ml: '$sm',
  },
  '& .MuiSkeleton-rect': {
    borderRadius: '$sm',
  },
});

export const Panel = styled('div', panelStyles);
