import { styled } from '../../stitches.config';

export const FormLabel = styled('label', {
  variants: {
    label: {
      true: {
        color: '$secondaryText',
        textTransform: 'uppercase',
        fontSize: '$small',
        fontFamily: 'Inter',
        fontWeight: '$semibold',
      },
    },
  },
});

export default FormLabel;
