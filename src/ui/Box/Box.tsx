import { styled } from '../../stitches.config';

export const Box = styled('div', {
  variants: {
    input: {
      true: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      },
    },
    errors: {
      true: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 0,
        minHeight: 45,
        color: '$red',
      },
    },
    grid: {
      twoColumns: {
        display: 'grid',
        width: '100%',
        'grid-template-columns': '1fr 1fr',
        'grid-template-rows': 'auto auto',
        'column-gap': '$lg',
        'row-gap': '$xl',
      },
    },
  },
});

export default Box;
