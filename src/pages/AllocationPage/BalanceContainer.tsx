import { styled } from '@stitches/react';

const BalanceContainer = styled('div', {
  position: 'fixed',
  // FIXME: magic numbers, maybe just defer this since we are replacing this asap w/ 1.5
  right: 50,
  top: /*theme.custom.appHeaderHeight*/ 82 + 90,
  zIndex: 1,
  padding: '$sm',
  display: 'flex',
  borderRadius: 8,
  justifyContent: 'flex-start',
  background: 'linear-gradient(0deg, #FAF1F2, #FAF1F2)',
  boxShadow: '2px 3px 6px rgba(81, 99, 105, 0.12)',
});

export default BalanceContainer;
