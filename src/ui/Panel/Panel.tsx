import { css, styled } from '../../stitches.config';

export const panelStyles = css({
  gridTemplateColumns: '1fr',
  mt: '$lg',
  alignItems: 'center',
  backgroundColor: '$gray',
  minHeight: '$panelBg',
  borderRadius: '$3',
});

export const Panel = styled('div', panelStyles);
