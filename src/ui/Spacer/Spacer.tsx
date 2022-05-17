import { styled } from '../../stitches.config';

export const Spacer = styled('div', {
  display: 'flex',
  alignSelf: 'stretch',
  variants: {
    size: {
      sm: {
        pb: '$sm',
      },
      md: {
        pb: '$md',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export default Spacer;
