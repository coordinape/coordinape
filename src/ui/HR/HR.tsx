import { styled } from '../../stitches.config';

export const HR = styled('hr', {
  height: '0.5px',
  width: '100%',
  border: 'none',
  background: '$borderDim',
  marginTop: '$md',
  marginBottom: '$md',

  variants: {
    sm: {
      true: {
        marginTop: '$sm',
        marginBottom: '$sm',
      },
    },
    noMargin: {
      true: {
        marginTop: '0',
        marginBottom: '0',
      },
    },
    flush: {
      true: {
        // TODO uncomment these negative margin rules after redesign launch
        marginLeft: '-$xl',
        width: 'calc(100% + $xl)',
      },
    },
  },
});

export default HR;
